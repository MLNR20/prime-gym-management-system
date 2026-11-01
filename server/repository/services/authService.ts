// src/services/authService.ts
import { AuthRepository } from "../authRepository";
import { RefreshTokenRepository } from "../refreshTokenRepository";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { IAdmin } from "../../models/admin";
import LogsRepository from "../../repository/logsRepository";
import MailService from "../../services/mailService";
import { JWT_SECRET } from "../../config/env";
import { ACCESS_TOKEN_TTL_MS, REFRESH_TOKEN_TTL_MS } from "../../utils/authCookies";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour
const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
// A refresh token that was rotated moments ago is still honoured, so parallel
// requests or tabs refreshing at the same time don't read as token theft.
const REFRESH_REUSE_GRACE_MS = 10 * 1000;

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function generateOtp(): string {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  admin: { first_name: string; last_name: string };
}

export type LoginResult =
  | ({ status: "success" } & AuthSession)
  | { status: "invalid_credentials" }
  | { status: "otp_pending" }
  | { status: "approval_pending" }
  | { status: "approval_rejected" };

export class AuthService {
  private authRepository: AuthRepository;
  private refreshTokenRepository: RefreshTokenRepository;

  constructor(authRepository: AuthRepository, refreshTokenRepository: RefreshTokenRepository) {
    this.authRepository = authRepository;
    this.refreshTokenRepository = refreshTokenRepository;
  }

  private signAccessToken(admin: IAdmin): string {
    return jwt.sign(
      {
        id: admin._id,
        first_name: admin.first_name,
        last_name: admin.last_name,
      },
      JWT_SECRET,
      { expiresIn: Math.floor(ACCESS_TOKEN_TTL_MS / 1000) }
    );
  }

  private async issueRefreshToken(admin_id: string, family: string): Promise<string> {
    const rawToken = crypto.randomBytes(48).toString("hex");
    await this.refreshTokenRepository.create(
      admin_id,
      hashToken(rawToken),
      family,
      new Date(Date.now() + REFRESH_TOKEN_TTL_MS)
    );
    return rawToken;
  }

  private async startSession(admin: IAdmin, family: string): Promise<AuthSession> {
    return {
      accessToken: this.signAccessToken(admin),
      refreshToken: await this.issueRefreshToken(admin._id!.toString(), family),
      admin: { first_name: admin.first_name, last_name: admin.last_name },
    };
  }

  async register(first_name: string, last_name: string, password: string, username: string, email:string): Promise<IAdmin>
  {
    await LogsRepository.logAction(
      "",
      `User ${first_name} ${last_name} created an account at ${new Date().toISOString()}`
    );

    return await this.authRepository.createUser(first_name, last_name, password, username, email);
  }

  async login(username: string, password: string): Promise<LoginResult>
  {
    const admin = await this.authRepository.verifyCredentials(username, password);

    if (!admin)
    {
      await LogsRepository.logAction("", `Failed login attempt at  ${new Date().toISOString()}`);
      return { status: "invalid_credentials" };
    }

    if (!admin.isOtpVerified) {
      return { status: "otp_pending" };
    }

    if (admin.approvalStatus === "rejected") {
      return { status: "approval_rejected" };
    }

    if (admin.approvalStatus !== "approved") {
      return { status: "approval_pending" };
    }

    const session = await this.startSession(admin, crypto.randomUUID());

    await LogsRepository.logAction(
      admin._id!.toString(),
      `${admin.first_name} ${
        admin.last_name
      } logged in at ${new Date().toISOString()}`
    );
    return { status: "success", ...session };
  }

  // Exchanges a refresh token for a new access/refresh pair. The presented
  // token is single-use: replaying one outside the grace window is treated as
  // theft and revokes every token in its family. Returns null when the token
  // is unknown, expired, reused or its account is no longer allowed to log in.
  async refresh(rawToken: string): Promise<AuthSession | null> {
    const tokenHash = hashToken(rawToken);
    const stored = await this.refreshTokenRepository.findByHash(tokenHash);
    if (!stored || stored.expiresAt.getTime() <= Date.now()) return null;

    if (stored.revokedAt) {
      if (Date.now() - stored.revokedAt.getTime() > REFRESH_REUSE_GRACE_MS) {
        await this.refreshTokenRepository.deleteFamily(stored.family);
        return null;
      }
    } else {
      const claimed = await this.refreshTokenRepository.revokeActive(tokenHash);
      if (!claimed) return null;
    }

    const admin = await this.authRepository.findById(stored.admin.toString());
    if (!admin || !admin.isOtpVerified || admin.approvalStatus !== "approved") {
      await this.refreshTokenRepository.deleteFamily(stored.family);
      return null;
    }

    return this.startSession(admin, stored.family);
  }

  async logout(rawToken: string | undefined): Promise<void> {
    if (!rawToken) return;
    const stored = await this.refreshTokenRepository.findByHash(hashToken(rawToken));
    if (stored) await this.refreshTokenRepository.deleteFamily(stored.family);
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const admin = await this.authRepository.findByEmail(email);
    if (!admin) return false;
    if (admin.isOtpVerified) return true;
    if (!admin.otpHash || !admin.otpExpires || admin.otpExpires.getTime() < Date.now()) return false;
    if (hashToken(otp) !== admin.otpHash) return false;

    await this.authRepository.markOtpVerified(admin._id!.toString());
    await LogsRepository.logAction(
      admin._id!.toString(),
      `${admin.first_name} ${admin.last_name} verified their email via OTP at ${new Date().toISOString()}`
    );
    return true;
  }

  async resendOtp(email: string): Promise<void> {
    const admin = await this.authRepository.findByEmail(email);

    // Always behave the same whether or not the email exists / already
    // verified, so callers can't use this endpoint to enumerate accounts.
    if (!admin || admin.isOtpVerified) return;

    const otp = generateOtp();
    await this.authRepository.setOtp(admin._id!.toString(), hashToken(otp), new Date(Date.now() + OTP_TTL_MS));
    await MailService.sendOtpEmail(admin.email, otp);
  }

  async forgotPassword(email: string): Promise<void> {
    const admin = await this.authRepository.findByEmail(email);

    // Always behave the same whether or not the email exists, so callers
    // can't use this endpoint to enumerate registered admin accounts.
    if (!admin) return;

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(rawToken);
    const expires = new Date(Date.now() + RESET_TOKEN_TTL_MS);

    await this.authRepository.setResetToken(admin._id!.toString(), tokenHash, expires);

    const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5180"}/reset-password/${rawToken}`;
    await MailService.sendPasswordResetEmail(admin.email, resetUrl);

    await LogsRepository.logAction(
      admin._id!.toString(),
      `Password reset requested for ${admin.first_name} ${admin.last_name} at ${new Date().toISOString()}`
    );
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const tokenHash = hashToken(token);
    const admin = await this.authRepository.findByResetTokenHash(tokenHash);

    if (!admin) return false;

    await this.authRepository.resetPassword(admin._id!.toString(), newPassword);
    // A password reset signs the account out everywhere.
    await this.refreshTokenRepository.deleteAllForAdmin(admin._id!.toString());

    await LogsRepository.logAction(
      admin._id!.toString(),
      `${admin.first_name} ${admin.last_name} reset their password at ${new Date().toISOString()}`
    );

    return true;
  }
}

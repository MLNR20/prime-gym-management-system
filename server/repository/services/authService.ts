// src/services/authService.ts
import { AuthRepository } from "../authRepository";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { IAdmin } from "../../models/admin";
import LogsRepository from "../../repository/logsRepository";
import MailService from "../../services/mailService";
import { JWT_SECRET } from "../../config/env";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour
const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function generateOtp(): string {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export type LoginResult =
  | { status: "success"; token: string }
  | { status: "invalid_credentials" }
  | { status: "otp_pending" }
  | { status: "approval_pending" }
  | { status: "approval_rejected" };

export class AuthService {
  private authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async register(first_name: string, last_name: string, password: string, username: string, email:string): Promise<IAdmin>
  {
    await LogsRepository.logAction(
      "",
      `User ${first_name} ${last_name} created an account at ${new Date().toISOString()}`
    );

    const admin = await this.authRepository.createUser(first_name, last_name, password, username, email);

    const otp = generateOtp();
    await this.authRepository.setOtp(admin._id!.toString(), hashToken(otp), new Date(Date.now() + OTP_TTL_MS));
    await MailService.sendOtpEmail(email, otp);

    return admin;
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

    const token = jwt.sign(
      {
        id: admin._id,
        first_name: admin.first_name,
        last_name: admin.last_name,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    await LogsRepository.logAction(
      admin._id!.toString(),
      `${admin.first_name} ${
        admin.last_name
      } logged in at ${new Date().toISOString()}`
    );
    return { status: "success", token };
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

    await LogsRepository.logAction(
      admin._id!.toString(),
      `${admin.first_name} ${admin.last_name} reset their password at ${new Date().toISOString()}`
    );

    return true;
  }
}

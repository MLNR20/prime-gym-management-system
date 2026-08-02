// src/services/authService.ts
import { AuthRepository } from "../authRepository";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { IAdmin } from "../../models/admin";
import LogsRepository from "../../repository/logsRepository";
import MailService from "../../services/mailService";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

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

    return this.authRepository.createUser(first_name, last_name, password, username, email);
  }

  async login(username: string, password: string): Promise<string | null> 
  {
    const admin = await this.authRepository.verifyCredentials(username, password);

    if (!admin) 
    {
      await LogsRepository.logAction("", `Failed login attempt at  ${new Date().toISOString()}`);
      return null;
    }

    const token = jwt.sign(
      {
        id: admin._id,
        first_name: admin.first_name,
        last_name: admin.last_name,
      },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    await LogsRepository.logAction(
      admin._id!.toString(),
      `${admin.first_name} ${
        admin.last_name
      } logged in at ${new Date().toISOString()}`
    );
    return token;
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

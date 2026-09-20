import Admin, { IAdmin } from "../models/admin";
import bcrypt from "bcrypt";
import { IAuthRepository } from "./interface/authRepositoryInterface";

export class AuthRepository implements IAuthRepository {

  async findByUsername(username: string): Promise<IAdmin | null> {
    return Admin.findOne({ username }).exec();
  }

  async createUser(first_name: string, last_name:string, password: string, username: string, email:string): Promise<IAdmin> {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Self-service signups must be verified (OTP) and approved by an existing
    // admin before they can log in, unlike seeded/legacy accounts which default to approved.
    const admin = new Admin({
      first_name,
      last_name,
      password: passwordHash,
      username,
      email,
      isOtpVerified: false,
      approvalStatus: "pending",
    });
    return await admin.save();
  }

  async findById(admin_id:string): Promise<IAdmin | null>{
    const admin = await Admin.findById(admin_id).exec();
    return admin;
  }

  async verifyCredentials(username: string, password: string): Promise<IAdmin | null> {
    const admin = await Admin.findOne({ username }).exec();
    if (!admin) return null;
    const isMatch = await bcrypt.compare(password, admin.password);
    return isMatch ? admin : null;
  }

  async findByEmail(email: string): Promise<IAdmin | null> {
    return Admin.findOne({ email }).exec();
  }

  async setResetToken(admin_id: string, tokenHash: string, expires: Date): Promise<void> {
    await Admin.findByIdAndUpdate(admin_id, {
      resetPasswordToken: tokenHash,
      resetPasswordExpires: expires,
    }).exec();
  }

  async findByResetTokenHash(tokenHash: string): Promise<IAdmin | null> {
    return Admin.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: new Date() },
    }).exec();
  }

  async resetPassword(admin_id: string, newPassword: string): Promise<void> {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);
    await Admin.findByIdAndUpdate(admin_id, {
      password: passwordHash,
      $unset: { resetPasswordToken: "", resetPasswordExpires: "" },
    }).exec();
  }

  async setOtp(admin_id: string, otpHash: string, expires: Date): Promise<void> {
    await Admin.findByIdAndUpdate(admin_id, {
      otpHash,
      otpExpires: expires,
    }).exec();
  }

  async markOtpVerified(admin_id: string): Promise<void> {
    await Admin.findByIdAndUpdate(admin_id, {
      isOtpVerified: true,
      $unset: { otpHash: "", otpExpires: "" },
    }).exec();
  }
}
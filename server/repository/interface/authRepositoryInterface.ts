
import { IAdmin } from "../../models/admin";

export interface IAuthRepository {
  findByUsername(username: string): Promise<IAdmin | null>;
  createUser(first_name:string, last_name:string, password: string, username: string, email:string): Promise<IAdmin>;
  verifyCredentials(first_name: string, password: string): Promise<IAdmin | null>;
  findByEmail(email: string): Promise<IAdmin | null>;
  setResetToken(admin_id: string, tokenHash: string, expires: Date): Promise<void>;
  findByResetTokenHash(tokenHash: string): Promise<IAdmin | null>;
  resetPassword(admin_id: string, newPassword: string): Promise<void>;

}
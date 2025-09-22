import Admin, { IAdmin } from "../models/admin";
import bcrypt from "bcrypt";
import { IAuthRepository } from "./interface/authRepositoryInterface";

export class AuthRepository implements IAuthRepository {
  async findByEmail(email: string): Promise<IAdmin | null> {
    return Admin.findOne({ email }).exec();
  }

  async findByUsername(username: string): Promise<IAdmin | null> {
    return Admin.findOne({ username }).exec();
  }

  async createUser(email: string, password: string, username: string): Promise<IAdmin> {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const admin = new Admin({ email, password: passwordHash, username });
    return await admin.save();
  }

  async verifyCredentials(email: string, password: string): Promise<IAdmin | null> {
    const admin = await Admin.findOne({ email }).exec();
    if (!admin) return null;

    const isMatch = await bcrypt.compare(password, admin.password);
    return isMatch ? admin : null;
  }
}
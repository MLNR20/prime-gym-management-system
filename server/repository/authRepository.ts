import Admin, { IAdmin } from "../models/admin";
import bcrypt from "bcrypt";
import { IAuthRepository } from "./interface/authRepositoryInterface";

export class AuthRepository implements IAuthRepository {

  async findByUsername(username: string): Promise<IAdmin | null> {
    return Admin.findOne({ username }).exec();
  }

  async createUser(first_name: string, last_name:string, password: string, username: string): Promise<IAdmin> {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const admin = new Admin({ first_name, last_name, password: passwordHash, username });
    return await admin.save();
  }

  async verifyCredentials(username: string, password: string): Promise<IAdmin | null> {
    const admin = await Admin.findOne({ username }).exec();
    if (!admin) return null;
    const isMatch = await bcrypt.compare(password, admin.password);
    return isMatch ? admin : null;
  }
}
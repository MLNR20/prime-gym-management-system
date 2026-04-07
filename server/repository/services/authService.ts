// src/services/authService.ts
import { AuthRepository } from "../authRepository";
import jwt from "jsonwebtoken";
import { IAdmin } from "../../models/admin";
import LogsRepository from "../../repository/logsRepository";

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
}

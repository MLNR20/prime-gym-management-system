// src/repositories/interfaces/IAuthRepository.ts
import { IAdmin } from "../../models/admin";

export interface IAuthRepository {
  findByEmail(email: string): Promise<IAdmin | null>;
  findByUsername(username: string): Promise<IAdmin | null>;
  createUser(email: string, password: string, username: string): Promise<IAdmin>;
  verifyCredentials(email: string, password: string): Promise<IAdmin | null>;
}
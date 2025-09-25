
import { IAdmin } from "../../models/admin";

export interface IAuthRepository {
  findByUsername(username: string): Promise<IAdmin | null>;
  createUser(first_name:string, last_name:string, password: string, username: string): Promise<IAdmin>;
  verifyCredentials(first_name: string, password: string): Promise<IAdmin | null>;

  
}
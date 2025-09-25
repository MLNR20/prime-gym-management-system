import { IExercise } from "../../models/exercise";

export interface IExerciseRepository {
  assignExercise(customer_id:string, exercise:{}): Promise<IExercise | null>;
  createUser(first_name:string, last_name:string, password: string, username: string): Promise<IExercise>;
  verifyCredentials(first_name: string, password: string): Promise<IExercise | null>;
}
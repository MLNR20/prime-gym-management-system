import { IExercise } from "../../models/exercise";
import { IProgram } from "../../models/program";
export interface IExerciseRepository {
  

  //method assign exercises to program

  //method assign programs to users
  assignProgram(customer_id:string, exercise:{}): Promise<IExercise | null>;
  verifyCredentials(first_name: string, password: string): Promise<IExercise | null>;
}
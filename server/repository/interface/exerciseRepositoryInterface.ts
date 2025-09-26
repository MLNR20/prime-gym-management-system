import { IExercise } from "../../models/exercise";
import { IProgram } from "../../models/program";

export interface IExerciseRepository {  
  createProgram(exercise_id:[]) : Promise<IProgram[]|null>;
  assignProgram(exercise:string, program_id:string): Promise<IExercise | null>;
}
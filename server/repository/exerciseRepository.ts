import Exercise, { IExerciseDocument } from "../models/exercise";
import GenericRepository from "./genericRepository";
import  { IExerciseRepository } from "./interface/exerciseRepositoryInterface"; 

export class ExerciseRepository extends GenericRepository<IExerciseDocument> 
{
    
}


export default new ExerciseRepository(Exercise);

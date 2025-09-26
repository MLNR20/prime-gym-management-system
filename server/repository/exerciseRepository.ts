import Exercise, { IExerciseDocument } from "../models/exercise";
import GenericRepository from "./genericRepository";


class ExerciseRepository extends GenericRepository<IExerciseDocument>
{
    async findByFirstName(first_name: string): Promise<IExerciseDocument | null> {
         return this.model.findOne({ first_name });
    }
}

export default new ExerciseRepository(Exercise);

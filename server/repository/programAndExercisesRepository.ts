import ProgramAndExercises from "../models/programandexercises";
import Exercise from "../models/exercise";

const ProgramAndExercisesRepository = {
  async findByProgram(programId: string) {
    const assignments = await ProgramAndExercises.find({ program_id: programId }).lean();
    const exerciseIds = assignments.map((a: any) => a.exercise_id);

    if (exerciseIds.length === 0) return [];

    const exercises = await Exercise.find({ _id: { $in: exerciseIds }, isDeleted: false }).lean();
    return exercises;
  },

  async assign(programId: string, exerciseId: string) {
    // prevent duplicates
    const exists = await ProgramAndExercises.findOne({ program_id: programId, exercise_id: exerciseId });
    if (exists) return exists;

    const doc = await ProgramAndExercises.create({ program_id: programId, exercise_id: exerciseId });
    return doc;
  },

  async unassign(programId: string, exerciseId: string) {
    const res = await ProgramAndExercises.deleteOne({ program_id: programId, exercise_id: exerciseId });
    return res.deletedCount && res.deletedCount > 0;
  },
};

export default ProgramAndExercisesRepository;

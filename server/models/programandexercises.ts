import { Schema, model, Document } from "mongoose";

export interface IProgramAndExercises {
  program_id: string;
  exercise_id:string;
  createdAt: Date;
  updatedAt: Date
}


export interface IProgramAndExercisesDocument extends IProgramAndExercises, Document {}

const programAndExercisesSchema = new Schema<IProgramAndExercisesDocument>(
  {
    program_id: { type: String, required: true, trim: true },
    exercise_id: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: {type:Date, default: Date.now}
  },
  { collection: "ProgramAndExercises" }
);

const ProgramAndExercises = model<IProgramAndExercisesDocument>("ProgramAndExercises", programAndExercisesSchema);

export default ProgramAndExercises;

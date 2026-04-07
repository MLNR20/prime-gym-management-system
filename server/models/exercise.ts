import { Schema, model, Document } from "mongoose";

export interface IExercise {
 exercise_name:String,
 target_area: String,
 reps: Number,
 sets: Number,
 createdAt: Date,
 updatedAt: Date,
 isDeleted: Boolean
}

enum TargetArea {
  Chest = "Chest",
  Legs = "Legs",
  Biceps = "Biceps",
  Triceps = "Triceps",
  Shoulders = "Shoulders",
  Abs = "Abs",
  Back = "Back",
  Forearms = "Forearms",
  Calves = "Calves",
  Glutes = "Glutes",
  Obliques = "Obliques",
  Traps = "Traps",
  Lats = "Lats",
  FullBody = "FullBody"
}

export interface IExerciseDocument extends IExercise, Document {}


const exerciseSchema = new Schema<IExerciseDocument>(
  {
    exercise_name: { type: String, required: true, trim: true },
    target_area: { type: String, enum: Object.values(TargetArea), required:true, trim: true },
    reps: {type: Number, required:true, default:1},
    sets: {type:Number, required:true, default:1},
    createdAt: { type: Date, default: Date.now },
    updatedAt: {type:Date, default: Date.now},
    isDeleted: {type:Boolean, default:false}
  },
  { collection: "Exercise" }
);

const Exercise = model<IExerciseDocument>("Exercise", exerciseSchema);

export default Exercise;

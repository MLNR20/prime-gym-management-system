import { Schema, model, Document } from "mongoose";

export interface IProgram {
  program_name: string;
  description:string;
  date_assigned:Date;
  createdAt: Date;
  updatedAt: Date
}


export interface IProgramDocument extends IProgram, Document {}

const programSchema = new Schema<IProgramDocument>(
  {
    program_name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    date_assigned: {type:Date, required:true, trim:true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: {type:Date, default: Date.now}
  },
  { collection: "Program" }
);

const program = model<IProgramDocument>("Program", programSchema);

export default program;

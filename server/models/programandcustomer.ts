import { Schema, model, Document } from "mongoose";

export interface IProgramAndCustomers {
  program_id: string;
  customer_id:string;
  createdAt: Date;
  updatedAt: Date
}

export interface IProgramAndCustomerDocument extends IProgramAndCustomers, Document {}

const programandcustomerSchema = new Schema<IProgramAndCustomerDocument>(
  {
    program_id: { type: String, required: true, trim: true },
    customer_id: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: {type:Date, default: Date.now}
  },
  { collection: "ProgramAndCustomers" }
);

const ProgramAndCustomers = model<IProgramAndCustomerDocument>("ProgramAndCustomers", programandcustomerSchema);

export default ProgramAndCustomers;

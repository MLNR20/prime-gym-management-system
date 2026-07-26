import { Schema, model, Document } from "mongoose";

export interface ISessionAssignment {
  customer_id: string;
  program_id: string;
  session_balance_after: number;
  assigned_at: Date;
}

export interface ISessionAssignmentDocument extends ISessionAssignment, Document {}

const sessionAssignmentSchema = new Schema<ISessionAssignmentDocument>(
  {
    customer_id: { type: String, required: true, trim: true },
    program_id: { type: String, required: true, trim: true },
    session_balance_after: { type: Number, required: true, min: 0 },
    assigned_at: { type: Date, default: Date.now, required: true },
  },
  { collection: "SessionAssignment" }
);

sessionAssignmentSchema.index({ customer_id: 1, assigned_at: -1 });

const SessionAssignment = model<ISessionAssignmentDocument>("SessionAssignment", sessionAssignmentSchema);

export default SessionAssignment;

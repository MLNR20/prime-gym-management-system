import { Schema, model, Document, StringExpressionOperatorReturningBoolean } from "mongoose";

export interface ILockerAssignment {
  locker_id: Number;
  customer_id: Number;
  time_in: String;
  time_out: String;
  status: String;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILockerAssignmentDocument extends ILockerAssignment, Document {}

const lockerAssignmentSchema = new Schema<ILockerAssignmentDocument>(
  {
    locker_id: { type: Number, trim: true },
    customer_id: {type: Number, trime:true},
    time_in: {type: String, default:""},
    time_out: {type:String, default:""},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "Expense" }
);

const Logs = model<ILockerAssignmentDocument>("lockerAssignment", lockerAssignmentSchema);

export default Logs;

import { Schema, model, Document, StringExpressionOperatorReturningBoolean } from "mongoose";

export interface ILockerAssignment {
  locker_id: String;
  customer_id: String;
  time_in: String;
  time_out: String;
  status: String;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILockerAssignmentDocument extends ILockerAssignment, Document {}

const lockerAssignmentSchema = new Schema<ILockerAssignmentDocument>(
  {
    locker_id: { type: String, trim: true },
    customer_id: {type: String, trim:true},
    time_in: {type: String, default:""},
    time_out: {type:String, default:""},
    status: {type:String, default:""},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "LockerAssignment" }
);

lockerAssignmentSchema.index({ customer_id: 1, createdAt: -1 });

const Logs = model<ILockerAssignmentDocument>("lockerAssignment", lockerAssignmentSchema);

export default Logs;

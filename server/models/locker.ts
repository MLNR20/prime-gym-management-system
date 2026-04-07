import { Schema, model, Document } from "mongoose";

export interface ILocker {
  locker_number: Number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILockerDocument extends ILocker, Document {}

const lockerSchema = new Schema<ILockerDocument>(
  {
    locker_number: { type: Number, trim: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "Expense" }
);

const Logs = model<ILockerDocument>("lockerSchema", lockerSchema);

export default Logs;

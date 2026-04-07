import { Schema, model, Document } from "mongoose";

export interface ILocker {
  locker_number: Number;
  is_active:Boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILockerDocument extends ILocker, Document {}

const lockerSchema = new Schema<ILockerDocument>(
  {
    locker_number: { type: Number, required: true },
    is_active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "Locker" }
);

lockerSchema.index(
  { locker_number: 1, is_active: 1 },
  {
    unique: true,
    partialFilterExpression: { is_active: true }
  }
);

const Locker = model<ILockerDocument>("Locker", lockerSchema);

export default Locker;

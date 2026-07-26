import { Schema, model, Document } from "mongoose";

export interface ISession {
  customer_id: string;
  created_at: Date;
  session_balance: number;
}

export interface ISessionDocument extends ISession, Document {}

const sessionSchema = new Schema<ISessionDocument>(
  {
    customer_id: { type: String, required: true, trim: true },
    created_at: { type: Date, default: Date.now, required: true },
    session_balance: { type: Number, required: true, min: 0 },
  },
  { collection: "Session" }
);

sessionSchema.index({ customer_id: 1, created_at: -1 });

const Session = model<ISessionDocument>("Session", sessionSchema);

export default Session;

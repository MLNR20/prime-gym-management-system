import { Schema, model, Document } from "mongoose";

export interface ISubscriptionHistory {
  customer_id: Number;
  amount: Number;
  status: String;
  dateRenewed:Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubscriptionHistoryDocument extends ISubscriptionHistory, Document {}

const subscriptionHistorySchema = new Schema<ISubscriptionHistoryDocument>(
  {
    customer_id: { type: String, trim: true },
    amount: {type: Number, trim:true},
    status: {type: Number, trim: true},
    dateRenewed: {type:Date, default:Date.now},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "SubscriptionHistory" }
);

const SubscriptionHistory = model<ISubscriptionHistoryDocument>("subscriptionHistory", subscriptionHistorySchema);

export default SubscriptionHistory;

import { Schema, model, Document } from "mongoose";

export interface ISales {
  customer_id: string;
  inventory_id: string;
  quantity: number;
  total_price: number;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISalesDocument extends ISales, Document {}

const salesSchema = new Schema<ISalesDocument>(
  {
    customer_id: { type: String, required: true, trim: true },
    inventory_id: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    total_price: { type: Number, required: true, min: 0 },
    is_active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "Sales" }
);

salesSchema.index({ customer_id: 1, createdAt: -1 });

const Sales = model<ISalesDocument>("Sales", salesSchema);

export default Sales;

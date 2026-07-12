import { Schema, model, Document } from "mongoose";

export interface ISales {
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
    inventory_id: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    total_price: { type: Number, required: true, min: 0 },
    is_active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "Sales" }
);

const Sales = model<ISalesDocument>("Sales", salesSchema);

export default Sales;

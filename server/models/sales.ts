import { Schema, model, Document } from "mongoose";

export interface ISales {
  inventory_id: String;
  quantity: Number;
  total_price: Number;
  is_active:Boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISalesDocument extends ISales, Document {}

const salesSchema = new Schema<ISalesDocument>(
  {
    inventory_id: { type: String, required: true },
    quantity: { type: Number, required: true },
    total_price : { type: Number, required: true },
    is_active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "Sales" }
);

salesSchema.index(
  { inventory_code: 1, is_active: 1 },
  {
    unique: true,
    partialFilterExpression: { is_active: true }
  }
);

const Sales = model<ISalesDocument>("Sales", salesSchema);

export default Sales;

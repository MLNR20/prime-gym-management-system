import { Schema, model, Document } from "mongoose";

export interface IExpense {
  expense_title: string;
  unit_price: number
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IExpenseDocument extends IExpense, Document {}

const logsSchema = new Schema<IExpenseDocument>(
  {
    admin_id: { type: String, trim: true },
    logs: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "Expense" }
);

const Logs = model<IExpenseDocument>("Logs", logsSchema);

export default Logs;

import { Schema, model, Document } from "mongoose";

export interface IExpense {
  expense_title: string;
  unit_price: number
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IExpenseDocument extends IExpense, Document {}

const expensesSchema = new Schema<IExpenseDocument>(
  {
    expense_title: { type: String, trim: true },
    unit_price: { type: Number, required: true, trim: true },
    quantity: {type: Number, required:true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "Expense" }
);

const Logs = model<IExpenseDocument>("expensesSchema", expensesSchema);

export default Logs;

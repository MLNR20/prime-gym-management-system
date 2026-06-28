import { Schema, model, Document } from "mongoose";

export interface IExpense {
  expense_title: string;
  unit_price: number
  quantity: number;
  categories: string;
  due_date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IExpenseDocument extends IExpense, Document {}

enum Categories
{
  rent = "Rent",
  utilities = "Utilities",
  wages = "Wages",
  equipment = "Equipment",
  maintenance = "Maintenance",
  supplies = "Supplies",
  miscellaneous = "Miscellaneous"
}

const expensesSchema = new Schema<IExpenseDocument>(
  {
    expense_title: { type: String, trim: true },
    unit_price: { type: Number, required: true, trim: true },
    quantity: {type: Number, required:true},
    categories: { type: String, enum: Object.values(Categories), required:true, trim: true },
    due_date: {type: Date, required:true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "Expense" }
);

const Expenses = model<IExpenseDocument>("Expenses", expensesSchema);

export default Expenses;

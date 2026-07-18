import { IExpense } from "../../models/expense";

export interface IExpenseRepository {
    getMonthlyBreakdown(): Promise<IExpense[]>;
    getTotalSum(): Promise<number>;
    getMonthlyTotalSum(): Promise<number>;
}
import Expense, { IExpenseDocument } from "../models/expense";
import GenericRepository from "./genericRepository";
import { IExpenseRepository } from "./interface/expenseRepositoryInferface";
import { IExpense } from "../models/expense";

export class ExpenseRepository extends GenericRepository<IExpenseDocument> implements IExpenseRepository {
    constructor() {
        super(Expense);
    }

    async getMonthlyBreakdown(): Promise<IExpense[]> {
        return await Expense.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    total: { $sum: "$amount" }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }
        ]);
    }

    async getTotalSum(): Promise<number> {
        const data: any = await Expense.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);

        return data.length > 0 ? data[0].total : 0;
    }

    async getMonthlyTotalSum(): Promise<number> {
        const data: any = await Expense.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    total: { $sum: "$amount" }
                }
            },
            {
                $sort: {
                    "_id.year": -1,
                    "_id.month": -1
                }
            },
            {
                $limit: 1
            }
        ]);

        return data.length > 0 ? data[0].total : 0;
    }
}

export default new ExpenseRepository();
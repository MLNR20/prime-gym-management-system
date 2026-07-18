import express from "express";
import ExpenseRepository from "../repository/expenseRepository";
import LogsRepository from "../repository/logsRepository";
import { authMiddleware } from "../middleware/middleware";
import { RequestWithUser } from "../middleware/types/express";

const expenseRouter = express.Router();

// CREATE
expenseRouter.post("/", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const newExpense = {
      expense_title: request.body.expense_title,
      unit_price: request.body.unit_price,
      quantity: request.body.quantity,
      categories: request.body.categories,
      due_date: request.body.due_date,
    };
    const admin = request.admin;
    await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} created expense called ${request.body.expense_title} at ${new Date().toISOString()}`);

    const createNewExpense = await ExpenseRepository.create(newExpense);
    return response.status(201).send(createNewExpense);
  } catch (error) {
    console.log(error);
  }
});

// READ ALL
expenseRouter.get("/", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const expenses = await ExpenseRepository.findAll();
    const admin = request.admin;
    await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} requested expense list at ${new Date().toISOString()}`);
    response.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error fetching expenses" });
  }
});

// PAGINATED EXPENSE LIST
expenseRouter.get("/show/", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const limit = parseInt(request.query.limit as string) || 10;
    const page = parseInt(request.query.page as string) || 1;
    const search = (request.query.search as string) || "";

    const result = await ExpenseRepository.search({
      page,
      limit,
      search,
      fields: ["expense_title", "categories"],
    });

    const admin = request.admin;
    await LogsRepository.logAction(
      admin!._id.toString(),
      `${admin!.first_name} ${admin?.last_name} accessed expenses list at ${new Date().toISOString()}`,
    );

    response.status(200).json(result);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error fetching expenses" });
  }
});

// RETRIEVE EXPENSE FOR EDITING
expenseRouter.get("/:id", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const retrieveExpense = await ExpenseRepository.findById(request.params.id!);

    if (!retrieveExpense) {
      return response.status(404).json({ message: "Failed to retrieve expense" });
    }

    const admin = request.admin;
    await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} retrieved expense at ${new Date().toISOString()}`);
    response.status(200).json(retrieveExpense);
  } catch (error) {
    response.status(500).json({ message: "Error fetching expense" });
  }
});

// UPDATE
expenseRouter.put("/:id", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const updatedExpense = await ExpenseRepository.update(
      request.params.id!,
      request.body
    );

    if (!updatedExpense) {
      return response.status(404).json({ message: "Expense not found" });
    }

    const admin = request.admin;
    await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} updated expense and changed ${request.body.expense_title}'s details at ${new Date().toISOString()}`);
    response.status(200).json(updatedExpense);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error updating expense" });
  }
});

// DELETE
expenseRouter.delete("/:id", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const deletedExpense = await ExpenseRepository.delete(request.params.id!);
    if (!deletedExpense) {
      return response.status(404).json({ message: "Expense not found" });
    }

    const admin = request.admin;
    await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} deleted expense at ${new Date().toISOString()}`);

    response.status(204).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error deleting expense" });
  }
});

// SOFT DELETE
expenseRouter.patch("/:id", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const deletedExpense = await ExpenseRepository.softDelete(request.params.id!, true);
    if (!deletedExpense) {
      return response.status(404).json({ message: "Expense not found" });
    }

    const admin = request.admin;
    await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} deleted expense at ${new Date().toISOString()}`);

    response.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error deleting expense" });
  }
});

// CREATE MANY
expenseRouter.post("/many/", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const docs = await ExpenseRepository.createMany(request.body);

    const admin = request.admin;
    await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} inserted many expenses at ${new Date().toISOString()}`);

    response.status(201).json(docs);
  } catch (err: any) {
    response.status(400).json({ error: err.message });
  }
});

export default expenseRouter;
import express from "express";
import sessionAssignmentRepository from "../repository/sessionAssignmentRepository";
import sessionRepository from "../repository/sessionRepository";
import programRepository from "../repository/programRepository";
import LogsRepository from "../repository/logsRepository";
import { RequestWithUser } from "../middleware/types/express";
import { authMiddleware } from "../middleware/middleware";

const sessionAssignmentRouter = express.Router();

// ASSIGN A PROGRAM TO A CUSTOMER'S SESSION (deducts one session, records history)
sessionAssignmentRouter.post(
  "/",
  authMiddleware,
  async (request: RequestWithUser, response) => {
    try {
      const { customer_id, program_id } = request.body;
      if (!customer_id || !program_id) {
        return response.status(400).json({ message: "customer_id and program_id are required" });
      }

      const program = await programRepository.findById(program_id);
      if (!program) return response.status(404).json({ message: "Program not found" });

      const deducted = await sessionRepository.deductSession(customer_id, 1);
      if (!deducted) {
        return response.status(400).json({ message: "Customer has no remaining sessions" });
      }

      const session_balance_after = await sessionRepository.getTotalBalance(customer_id);

      const record = await sessionAssignmentRepository.create({
        customer_id,
        program_id,
        session_balance_after,
        assigned_at: new Date(),
      });

      const admin = request.admin;
      await LogsRepository.logAction(
        admin!._id.toString(),
        `${admin!.first_name} ${admin?.last_name} assigned program ${program.program_name} to customer ${customer_id}'s session at ${new Date().toISOString()}`
      );

      response.status(201).json({ success: true, session_balance: session_balance_after, assignment: record });
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: "Error assigning program to session" });
    }
  }
);

// PAGINATED HISTORY OF SESSION ASSIGNMENTS (enriched with customer + program details)
sessionAssignmentRouter.get(
  "/show/",
  authMiddleware,
  async (request: RequestWithUser, response) => {
    try {
      const limit = parseInt(request.query.limit as string) || 10;
      const page = parseInt(request.query.page as string) || 1;
      const search = (request.query.search as string) || "";

      const pipeline = [
        {
          $addFields: {
            customerObjectId: { $toObjectId: "$customer_id" },
            programObjectId: { $toObjectId: "$program_id" },
          },
        },
        {
          $lookup: {
            from: "Customer",
            localField: "customerObjectId",
            foreignField: "_id",
            as: "customer",
          },
        },
        { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "Program",
            localField: "programObjectId",
            foreignField: "_id",
            as: "program",
          },
        },
        { $unwind: { path: "$program", preserveNullAndEmptyArrays: true } },
        { $sort: { assigned_at: -1 as const } },
        {
          $project: {
            _id: 1,
            first_name: "$customer.first_name",
            last_name: "$customer.last_name",
            program_name: "$program.program_name",
            session_balance_after: 1,
            assigned_at: 1,
            createdAt: 1,
          },
        },
      ];

      const result = await sessionAssignmentRepository.paginateWithLookup({
        page,
        limit,
        pipeline,
        search,
        fields: ["first_name", "last_name", "program_name"],
      });

      const admin = request.admin;
      await LogsRepository.logAction(
        admin!._id.toString(),
        `${admin!.first_name} ${admin?.last_name} accessed session assignment history at ${new Date().toISOString()}`
      );

      response.status(200).json(result);
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: "Error fetching session assignment history" });
    }
  }
);

export default sessionAssignmentRouter;

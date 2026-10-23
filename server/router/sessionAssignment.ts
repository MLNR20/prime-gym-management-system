import express, { Response } from "express";
import unitOfWork from "../repository/unitOfWork";
import { SessionAssignmentService } from "../repository/services/sessionAssignmentService";
import LogsRepository from "../repository/logsRepository";
import { RequestWithUser } from "../middleware/types/express";
import { authMiddleware } from "../middleware/middleware";
import { validate, createSessionAssignmentValidation } from "../utils/validation";

const sessionAssignmentRouter = express.Router();
const sessionAssignmentService = new SessionAssignmentService(unitOfWork);

// ASSIGN A PROGRAM TO A CUSTOMER'S SESSION (deducts one session, records history)
sessionAssignmentRouter.post(
  "/",
  authMiddleware,
  createSessionAssignmentValidation,
  validate,
  async (request: RequestWithUser, response: Response) => {
    try {
      const { customer_id, program_id } = request.body;

      const result = await sessionAssignmentService.assignProgram(customer_id, program_id);
      if (result.status === "program_not_found") {
        return response.status(404).json({ message: "Program not found" });
      }
      if (result.status === "no_sessions") {
        return response.status(400).json({ message: "Customer has no remaining sessions" });
      }

      const admin = request.admin;
      await LogsRepository.logAction(
        admin!._id.toString(),
        `${admin!.first_name} ${admin?.last_name} assigned program ${result.programName} to customer ${customer_id}'s session at ${new Date().toISOString()}`
      );

      response.status(201).json({ success: true, session_balance: result.sessionBalance, assignment: result.assignment });
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

      const result = await sessionAssignmentService.getHistory(page, limit, search);

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

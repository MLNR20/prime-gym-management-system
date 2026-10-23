import express, { Response } from "express";
import unitOfWork from "../repository/unitOfWork";
import { SessionService } from "../repository/services/sessionService";
import LogsRepository from "../repository/logsRepository";
import { RequestWithUser } from "../middleware/types/express";
import { authMiddleware } from "../middleware/middleware";
import { validate, assignSessionValidation } from "../utils/validation";

const sessionRouter = express.Router();
const sessionService = new SessionService(unitOfWork);

// READ (paginated, searchable list for the Sessions table)
sessionRouter.get(
  "/show/",
  authMiddleware,
  async (request: RequestWithUser, response) => {
    try {
      const limit = parseInt(request.query.limit as string) || 10;
      const page = parseInt(request.query.page as string) || 1;
      const search = (request.query.search as string) || "";
      const customerId = (request.query.customerId as string) || "";

      const result = await sessionService.search(page, limit, search, customerId);

      const admin = request.admin;
      await LogsRepository.logAction(
        admin!._id.toString(),
        `${admin!.first_name} ${admin?.last_name} accessed sessions list at ${new Date().toISOString()}`
      );

      response.status(200).json(result);
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: "Error fetching sessions" });
    }
  }
);

// READ CUSTOMERS ELIGIBLE FOR COACHING SESSION ASSIGNMENT (with their session balance)
sessionRouter.get(
  "/coaching-customers",
  authMiddleware,
  async (request: RequestWithUser, response) => {
    try {
      const withBalance = await sessionService.getCoachingCustomers();

      const admin = request.admin;
      await LogsRepository.logAction(
        admin!._id.toString(),
        `${admin!.first_name} ${admin?.last_name} accessed coaching customers list at ${new Date().toISOString()}`
      );

      response.status(200).json(withBalance);
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: "Error fetching coaching customers" });
    }
  }
);

// ASSIGN A SESSION TO A CUSTOMER (deducts one session from their remaining balance)
sessionRouter.post(
  "/assign",
  authMiddleware,
  assignSessionValidation,
  validate,
  async (request: RequestWithUser, response: Response) => {
    try {
      const customerId = request.body.customer_id;

      const balance = await sessionService.assign(customerId);
      if (balance === null) {
        return response.status(400).json({ message: "Customer has no remaining sessions" });
      }

      const admin = request.admin;
      await LogsRepository.logAction(
        admin!._id.toString(),
        `${admin!.first_name} ${admin?.last_name} assigned a coaching session to customer ${customerId} at ${new Date().toISOString()}`
      );

      response.status(200).json({ success: true, session_balance: balance });
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: "Error assigning session" });
    }
  }
);

// READ ALL SESSIONS FOR A SPECIFIC CUSTOMER
sessionRouter.get(
  "/customer/:id",
  authMiddleware,
  async (request: RequestWithUser, response) => {
    try {
      const customerId = request.params.id;
      if (!customerId) {
        return response.status(400).json({ message: "Customer id is required" });
      }

      const limit = parseInt(request.query.limit as string) || 10;
      const sessions = await sessionService.getByCustomerId(customerId, limit);

      return response.status(200).json(sessions);
    } catch (error) {
      return response.status(500).json({ message: "Error fetching customer sessions" });
    }
  }
);

export default sessionRouter;

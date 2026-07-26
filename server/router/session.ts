import express from "express";
import sessionRepository from "../repository/sessionRepository";
import customerRepository from "../repository/customerRepository";
import LogsRepository from "../repository/logsRepository";
import { RequestWithUser } from "../middleware/types/express";
import { authMiddleware } from "../middleware/middleware";

const sessionRouter = express.Router();

async function enrichSessionsWithCustomer(sessions: any[]) {
  return Promise.all(
    sessions.map(async (session) => {
      const customer = session.customer_id
        ? await customerRepository.findById(session.customer_id)
        : null;
      return {
        ...session,
        first_name: customer?.first_name ?? "N/A",
        last_name: customer?.last_name ?? "",
      };
    })
  );
}

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

      const result = await sessionRepository.search({
        page,
        limit,
        search,
        fields: [],
        filter: customerId ? { customer_id: customerId } : {},
      });

      const enrichedData = await enrichSessionsWithCustomer(result.data);

      const admin = request.admin;
      await LogsRepository.logAction(
        admin!._id.toString(),
        `${admin!.first_name} ${admin?.last_name} accessed sessions list at ${new Date().toISOString()}`
      );

      response.status(200).json({ ...result, data: enrichedData });
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
      const customers = await customerRepository.findCoachingCustomers();

      const withBalance = await Promise.all(
        customers.map(async (customer: any) => {
          const balance = await sessionRepository.getTotalBalance(String(customer._id));
          return {
            _id: customer._id,
            first_name: customer.first_name,
            last_name: customer.last_name,
            subscription_type: customer.subscription_type,
            status: customer.status,
            session_balance: balance,
          };
        })
      );

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
  async (request: RequestWithUser, response) => {
    try {
      const customerId = request.body.customer_id;
      if (!customerId) {
        return response.status(400).json({ message: "customer_id is required" });
      }

      const updatedSession = await sessionRepository.deductSession(customerId, 1);
      if (!updatedSession) {
        return response.status(400).json({ message: "Customer has no remaining sessions" });
      }

      const balance = await sessionRepository.getTotalBalance(customerId);

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
      const sessions = await sessionRepository.findByCustomerId(customerId, limit);
      const enriched = await enrichSessionsWithCustomer(
        sessions.map((s) => (s.toObject ? s.toObject() : s))
      );

      return response.status(200).json(enriched);
    } catch (error) {
      return response.status(500).json({ message: "Error fetching customer sessions" });
    }
  }
);

export default sessionRouter;

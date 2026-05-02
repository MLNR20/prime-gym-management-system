import express, { Response } from "express";
import { authMiddleware } from "../middleware/middleware";
import { RequestWithUser } from "../middleware/types/express";
import LogsRepository from "../repository/logsRepository";
import SubscriptionHistoryRepository from "../repository/subscriptionhistoryRepository";

const SubscriptionHistoryRepositoryRouter = express.Router();

// RETRIEVE SUBSCRIPTION HISTORY LIST
SubscriptionHistoryRepositoryRouter.get("/", authMiddleware, async (req: RequestWithUser, res: Response) => {
  try {
    const logsList = await SubscriptionHistoryRepository.findAll();
    res.status(200).json(logsList);
  } catch (error) {
    console.log(error);
  }
});

// PAGINATION SUBSCRIPTION HISTORY LIST
SubscriptionHistoryRepositoryRouter.get("/show/", authMiddleware, async (request: RequestWithUser, response: Response) => {
    try {
      const limit = parseInt(request.query.limit as string) || 10;
      const page = parseInt(request.query.page as string) || 1;
      const result = await SubscriptionHistoryRepository.paginate({
        page,
        limit,
      });
      const admin = request.admin;
      await LogsRepository.logAction(
        admin!._id.toString(),
        `${admin!.first_name} ${admin?.last_name} accessed logs list at ${new Date().toISOString()}`,
      );
      response.status(200).json(result);
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: "Error fetching logs" });
    }
  },
);



export default SubscriptionHistoryRepositoryRouter;

import express, { Response } from "express";
import LogsRepository from "../repository/logsRepository";
import { authMiddleware } from "../middleware/middleware";
import { RequestWithUser } from "../middleware/types/express";
import logsRepository from "../repository/logsRepository";

const logsRouter = express.Router();

// RETRIEVE CONTACTS LIST
logsRouter.get("/", authMiddleware, async (req: RequestWithUser, res: Response) => {
  try {
    const logsList = await logsRepository.findAll();
    res.status(200).json(logsList);
  } catch (error) {
    console.log(error);
  }
});


export default logsRouter;

import express, { Response } from "express";
import logsRepository from "../repository/logsRepository";
import adminRepository from "../repository/adminRepository";
import { authMiddleware } from "../middleware/middleware";
import { RequestWithUser } from "../middleware/types/express";

const adminRouter = express.Router();

adminRouter.get(
  "/",
  authMiddleware,
  async (req: RequestWithUser, res: Response) => {
    try {
      const retrieveAdminDetails = await adminRepository.findAll();
      
      const safeAdmins = retrieveAdminDetails.map((admin) => {
        const { password, username, ...rest } = admin.toObject();
        return rest;
      });

      return res.status(200).json(safeAdmins);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
    }
  },
);

export default adminRouter;

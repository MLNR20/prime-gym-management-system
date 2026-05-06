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

adminRouter.get(
  "/show/",
  authMiddleware,
  async (req: RequestWithUser, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const page = parseInt(req.query.page as string) || 1;
      const result = await adminRepository.paginate({
        page,
        limit,
      });
      const admin = req.admin;
      await logsRepository.logAction(
        admin!._id.toString(),
        `${admin!.first_name} ${admin?.last_name} accessed admin list at ${new Date().toISOString()}`,
      );

      return res.status(200).json(
        result,
      );
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
    }
  },
);

export default adminRouter;

import express, { Response } from "express";
import LogsRepository from "../repository/logsRepository";
import adminRepository from "../repository/adminRepository";
import { authMiddleware } from "../middleware/middleware";
import { RequestWithUser } from "../middleware/types/express";
import { Types } from "mongoose";


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
      await LogsRepository.logAction(
        admin!._id.toString(),
        `${admin!.first_name} ${admin?.last_name} accessed admin list at ${new Date().toISOString()}`,
      );

      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
    }
  },
);

adminRouter.patch(
  "/:id",
  authMiddleware,
  async (req: RequestWithUser, res: Response) => {
    try {
      const adminId = await adminRepository.findById(req.params.id!);
      if (!adminId)
        return res.status(404).json({ message: "Customer not found" });

      const admin = req.admin;
      await LogsRepository.logAction(
        admin!._id.toString(),
        `${admin!.first_name} ${admin?.last_name} deactivated admin account at ${new Date().toISOString()}`,
      );

      await adminRepository.deactivateAccount((adminId as any)._id.toString());
      res.status(204).json({message:"Admin account successfully deleted!", adminId});
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error in detailing activation" });
    }
  },
);
export default adminRouter;

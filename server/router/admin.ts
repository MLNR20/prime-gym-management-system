import express, { Response } from "express";
import LogsRepository from "../repository/logsRepository";
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
  "/me",
  authMiddleware,
  async (req: RequestWithUser, res: Response) => {
    try {
      const admin = await adminRepository.findById(req.admin!._id);
      if (!admin) return res.status(404).json({ message: "Admin not found" });

      const { password, username, ...safeAdmin } = admin.toObject();
      return res.status(200).json(safeAdmin);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching admin profile" });
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
      const search = (req.query.search as string) || "";

      const result = await adminRepository.search({
        page,
        limit,
        search,
        fields: ["first_name", "last_name", "email"],
        // Deactivated admins must stay visible here (unlike other entities)
        // so an admin can be renewed instead of only ever deactivated.
        includeDeleted: true,
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
      res
        .status(204)
        .json({ message: "Admin account successfully deleted!", adminId });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error in detailing activation" });
    }
  },
);

adminRouter.patch(
  "/:id/approve",
  authMiddleware,
  async (req: RequestWithUser, res: Response) => {
    try {
      const targetAdmin = await adminRepository.findById(req.params.id!);
      if (!targetAdmin)
        return res.status(404).json({ message: "Admin not found" });

      const admin = req.admin;
      await LogsRepository.logAction(
        admin!._id.toString(),
        `${admin!.first_name} ${admin?.last_name} approved admin account ${(targetAdmin as any)._id} at ${new Date().toISOString()}`,
      );

      await adminRepository.approveAccount((targetAdmin as any)._id.toString());
      res.status(200).json({ message: "Admin account approved" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error approving admin account" });
    }
  },
);

adminRouter.patch(
  "/:id/reject",
  authMiddleware,
  async (req: RequestWithUser, res: Response) => {
    try {
      const targetAdmin = await adminRepository.findById(req.params.id!);
      if (!targetAdmin)
        return res.status(404).json({ message: "Admin not found" });

      const admin = req.admin;
      await LogsRepository.logAction(
        admin!._id.toString(),
        `${admin!.first_name} ${admin?.last_name} rejected admin account ${(targetAdmin as any)._id} at ${new Date().toISOString()}`,
      );

      await adminRepository.rejectAccount((targetAdmin as any)._id.toString());
      res.status(200).json({ message: "Admin account rejected" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error rejecting admin account" });
    }
  },
);

adminRouter.patch(
  "/:id/renew",
  authMiddleware,
  async (req: RequestWithUser, res: Response) => {
    try {
      const targetAdmin = await adminRepository.findById(req.params.id!);
      if (!targetAdmin)
        return res.status(404).json({ message: "Admin not found" });

      const admin = req.admin;
      await LogsRepository.logAction(
        admin!._id.toString(),
        `${admin!.first_name} ${admin?.last_name} renewed admin account ${(targetAdmin as any)._id} at ${new Date().toISOString()}`,
      );

      await adminRepository.renewAccount((targetAdmin as any)._id.toString());
      res.status(200).json({ message: "Admin account renewed" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error renewing admin account" });
    }
  },
);

export default adminRouter;

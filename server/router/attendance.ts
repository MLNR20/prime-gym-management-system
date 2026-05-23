import express, { Response } from "express";
import { authMiddleware } from "../middleware/middleware";
import { RequestWithUser } from "../middleware/types/express";
import lockerRepository from "../repository/lockerRepository";
import lockerAssignmentRepository from "../repository/lockerAssignmentRepository";
import customerRepository from "../repository/customerRepository";
import logsRepository from "../repository/logsRepository";

import { AttendanceService } from "../repository/services/attendanceService";

const attendanceRouter = express.Router();
const attendanceService = new AttendanceService(
  lockerRepository,
  lockerAssignmentRepository,
  customerRepository,
);

attendanceRouter.post(
  "/",
  authMiddleware,
  async (req: RequestWithUser, res: Response) => {
    try {
      if (!req.body.customer_id) {
        return res.status(404).json({ message: "Customer id missing!" });
      }

      if (!req.body.locker_id) {
        return res.status(404).json({ message: "Locker id missing!" });
      }

      await attendanceService.createAttendance(
        req.body.locker_id,
        req.body.customer_id,
      );

      const lockerDetails = await lockerRepository.findById(req.body.locker_id);

      const admin = req.admin;
      await logsRepository.logAction(
        admin!._id.toString(),
        `${admin!.first_name} ${admin?.last_name} assigned locker key ${lockerDetails?.locker_number} at ${new Date().toISOString()}`,
      );

      res.status(201).json({
        message: "Attendance Created",
      });
    } catch (error) {
      res.status(500).json({
        message: "Cannot create attendance",
      });
    }
  },
);

attendanceRouter.put(
  "/:id",
  authMiddleware,
  async (req: RequestWithUser, res: Response) => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(404).json({ message: "Attendance Id is missing." });
      }

      const lockerAssignmentDetails = await lockerAssignmentRepository.findById(
        String(id),
      );
      if (!lockerAssignmentDetails)
        res.status(404).json({ message: "Attendance Details is missing." });
      const lockerDetails = await lockerRepository.findById(
        String(lockerAssignmentDetails!._id),
      );

      const admin = req.admin;
      await logsRepository.logAction(
        admin!._id.toString(),
        `${admin!.first_name} ${admin?.last_name} has received returned ${lockerDetails?.locker_number} at ${new Date().toISOString()}`,
      );

      await attendanceService.returnLockerKey(req.params.id!);
      res.status(201).json({ message: "Locker Key Returned" });
    } catch (error) {
      res.status(500).json({
        message: "Cannot create attendance",
      });
    }
  },
);

attendanceRouter.get(
  "/show/",
  authMiddleware,
  async (req: RequestWithUser, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const page = parseInt(req.query.page as string) || 1;
      const search = (req.query.search as string) || "";
      const pipeline = [
              {
                $addFields: {
                  customer_id: { $toObjectId: "$customer_id" }, 
                  locker_id: { $toObjectId: "$locker_id" }, 
                },
              },
              {
                $lookup: {
                  from: "Customer", 
                  localField: "customer_id",
                  foreignField: "_id",
                  as: "customer",
                },
              },
              {
                $lookup: {
                  from: "Locker", 
                  localField: "locker_id",
                  foreignField: "_id",
                  as: "locker",
                },
              },
              {
                $unwind: {
                  path: "$customer",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $project: {
                  _id: 1,
                  first_name: "$customer.first_name",
                  last_name: "$customer.last_name",
                  status: 1,
                  time_in: 1,
                  time_out: 1,
                  locker_number: "$locker.locker_number"
                },
              },
            ];

      const result = await lockerAssignmentRepository.paginateWithLookup({
        page,
        limit,
        pipeline,
        search,
        fields: ["first_name", "last_name", "locker_number", "status"],
      });

      const admin = req.admin;
      await logsRepository.logAction(
        admin!._id.toString(),
        `${admin!.first_name} ${admin?.last_name} accessed subscription history list at ${new Date().toISOString()}`,
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        message: "Cannot retrieve attendance",
      });
    }
  },
);

attendanceRouter.delete(
  "/:id",
  authMiddleware,
  async (req: RequestWithUser, res: Response) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(404).json({ message: "Attendance Id is missing." });
      }

      const deletedAssignment = await lockerAssignmentRepository.delete(id);

      if (!deletedAssignment) {
        return res.status(404).json({ message: "Attendance record not found." });
      }

      const admin = req.admin;
      await logsRepository.logAction(
        admin!._id.toString(),
        `${admin!.first_name} ${admin?.last_name} deleted attendance record ${id} at ${new Date().toISOString()}`,
      );

      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Cannot delete attendance",
      });
    }
  }
);

export default attendanceRouter;

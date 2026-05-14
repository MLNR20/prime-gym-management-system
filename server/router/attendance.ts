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

      const lockerDetails = await lockerRepository.findById(req.body.locker_id)

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

      const lockerAssignmentDetails = await lockerAssignmentRepository.findById(String(id))
      if(!lockerAssignmentDetails) res.status(404).json({ message: "Attendance Details is missing." });
      const lockerDetails = await lockerRepository.findById(String(lockerAssignmentDetails!._id))
    
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

export default attendanceRouter;

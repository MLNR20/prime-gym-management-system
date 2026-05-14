import express, { Response } from "express";
import { authMiddleware } from "../middleware/middleware";
import { RequestWithUser } from "../middleware/types/express";
import lockerRepository from "../repository/lockerRepository";
import lockerAssignmentRepository from "../repository/lockerAssignmentRepository";
import customerRepository from "../repository/customerRepository";

import { AttendanceService } from "../repository/services/attendanceService";

const attendanceRouter = express.Router();
const attendanceService = new AttendanceService(
  lockerRepository,
  lockerAssignmentRepository,
  customerRepository,
);
attendanceRouter.post("/", authMiddleware, async (req: RequestWithUser, res: Response) => {
    try
    {
      if (!req.body.customer_id) {
        return res.status(404).json({ message: "Customer not found!" });
      }

      if (!req.body.locker_id) {
        return res.status(404).json({ message: "Locker not found!" });
      }

      await attendanceService.createAttendance(
        req.body.locker_id,
        req.body.customer_id,
      );

      const countDuplicate = await lockerAssignmentRepository.preventDuplicateBorrows(req.body.customer_id, req.body.locker_id)

      res.status(201).json({
        message: "Attendance Created",
        count: countDuplicate
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Cannot create attendance",
      });
    }
  },
);

export default attendanceRouter;

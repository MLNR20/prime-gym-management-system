import { Response } from "express";
import unitOfWork from "../../repository/unitOfWork";
import lockerAssignmentRepository from "../../repository/lockerAssignmentRepository";
import LogsRepository from "../../repository/logsRepository";
import { AttendanceService } from "../../repository/services/attendanceService";
import { CustomerService } from "../../repository/services/customerService";
import { LockerService } from "../../repository/services/lockerService";
import { RequestWithUser } from "../../middleware/types/express";

const attendanceService = new AttendanceService(unitOfWork);
const customerService = new CustomerService(unitOfWork);
const lockerService = new LockerService(unitOfWork);

const logAdminAction = async (request: RequestWithUser, action: string) => {
  const admin = request.admin;
  await LogsRepository.logAction(
    admin!._id.toString(),
    `${admin!.first_name} ${admin?.last_name} ${action} at ${new Date().toISOString()}`,
  );
};

//CREATE ATTENDANCE
export const createAttendance = async (
  request: RequestWithUser,
  response: Response,
) => {
  try {
    if (!request.body.customer_id) {
      return response.status(404).json({ message: "Customer id missing!" });
    }

    if (!request.body.locker_id) {
      return response.status(404).json({ message: "Locker id missing!" });
    }

    const { customer_id, locker_id, time_in } = request.body;

    await attendanceService.createAttendance(locker_id, customer_id, time_in);

    const lockerDetails = await lockerService.getById(locker_id);
    await logAdminAction(request, `assigned locker key ${lockerDetails?.locker_number}`);

    return response.status(201).json({ message: "Attendance Created" });
  } catch (error) {
    return response.status(500).json({ message: "Cannot create attendance" });
  }
};

//UPDATE ATTENDANCE / RETURN LOCKER KEY
export const updateAttendance = async (
  request: RequestWithUser,
  response: Response,
) => {
  try {
    const { id } = request.params;

    if (!id) {
      return response.status(404).json({ message: "Attendance Id is missing." });
    }

    // If client sent update fields, perform update (emulate Add_Attendance behavior)
    const { customer_id, locker_id, time_in } = request.body;

    if (customer_id || locker_id || time_in) {
      const updateData: any = {};
      if (customer_id) updateData.customer_id = customer_id;
      if (locker_id) updateData.locker_id = locker_id;
      if (time_in) updateData.time_in = time_in;

      const updated = await lockerAssignmentRepository.update(String(id), updateData);

      if (!updated) {
        return response.status(404).json({ message: "Attendance record not found." });
      }

      await logAdminAction(request, `updated attendance ${id}`);
      return response.status(200).json({ message: "Attendance Updated" });
    }

    // Otherwise treat as return (existing behavior)
    const lockerAssignmentDetails = await lockerAssignmentRepository.findById(String(id));
    if (!lockerAssignmentDetails) {
      return response.status(404).json({ message: "Attendance Details is missing." });
    }

    const lockerDetails = await lockerService.getById(String(lockerAssignmentDetails.locker_id));
    await logAdminAction(request, `has received returned ${lockerDetails?.locker_number}`);

    await attendanceService.returnLockerKey(id);
    return response.status(201).json({ message: "Locker Key Returned" });
  } catch (error) {
    return response.status(500).json({ message: "Cannot create attendance" });
  }
};

//SEARCH / PAGINATE ATTENDANCE
export const searchAttendance = async (
  request: RequestWithUser,
  response: Response,
) => {
  try {
    const limit = parseInt(request.query.limit as string) || 10;
    const page = parseInt(request.query.page as string) || 1;
    const search = (request.query.search as string) || "";
    const customerId = (request.query.customerId as string) || "";
    const pipeline = [
      ...(customerId ? [{ $match: { customer_id: customerId } }] : []),
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
          locker_number: "$locker.locker_number",
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

    await logAdminAction(request, "accessed subscription history list");
    return response.status(200).json(result);
  } catch (error) {
    return response.status(500).json({ message: "Cannot retrieve attendance" });
  }
};

//DAILY ATTENDANCE BREAKDOWN
export const getDailyBreakdown = async (
  request: RequestWithUser,
  response: Response,
) => {
  try {
    const days = parseInt(request.query.days as string) || 30;
    const [dailyCounts, total] = await Promise.all([
      lockerAssignmentRepository.dailyAttendanceCounts(days),
      lockerAssignmentRepository.totalAttendanceCount(),
    ]);

    return response.status(200).json({ dailyCounts, total });
  } catch (error) {
    return response.status(500).json({ message: "Cannot retrieve attendance breakdown" });
  }
};

//RETRIEVE ATTENDANCE BY CUSTOMER
export const getAttendanceByCustomer = async (
  request: RequestWithUser,
  response: Response,
) => {
  try {
    const customerId = request.params.id;
    if (!customerId) {
      return response.status(404).json({ message: "Customer Id is missing." });
    }

    const limit = parseInt(request.query.limit as string) || 10;
    const attendance = await lockerAssignmentRepository.findByCustomerId(customerId, limit);
    return response.status(200).json(attendance);
  } catch (error) {
    return response.status(500).json({ message: "Cannot retrieve customer attendance" });
  }
};

//DELETE ATTENDANCE
export const deleteAttendance = async (
  request: RequestWithUser,
  response: Response,
) => {
  try {
    const { id } = request.params;

    if (!id) {
      return response.status(404).json({ message: "Attendance Id is missing." });
    }

    const deletedAssignment = await lockerAssignmentRepository.delete(id);

    if (!deletedAssignment) {
      return response.status(404).json({ message: "Attendance record not found." });
    }

    await logAdminAction(request, `deleted attendance record ${id}`);
    return response.status(204).send();
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Cannot delete attendance" });
  }
};

//RETRIEVE ATTENDANCE BY ID
export const getAttendanceById = async (
  request: RequestWithUser,
  response: Response,
) => {
  try {
    const { id } = request.params;

    if (!id) {
      return response.status(404).json({ message: "Attendance Id is missing." });
    }

    const lockerAssignmentDetails = await lockerAssignmentRepository.findById(String(id));

    if (!lockerAssignmentDetails) {
      return response.status(404).json({ message: "Attendance record not found." });
    }

    // Preserved from the router: these lookups gate the request but are not returned.
    await customerService.getById(String(lockerAssignmentDetails.customer_id));
    await lockerService.getById(String(lockerAssignmentDetails.locker_id));

    await logAdminAction(request, `accessed attendance edit record ${id}`);
    return response.status(200).json({
      customer_id: lockerAssignmentDetails.customer_id,
      locker_id: lockerAssignmentDetails.locker_id,
      time_in: lockerAssignmentDetails.time_in,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Cannot retrieve attendance record" });
  }
};

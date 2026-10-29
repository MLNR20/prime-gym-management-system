import { Response } from "express";
import unitOfWork from "../../repository/unitOfWork";
import { LockerService } from "../../repository/services/lockerService";
import LogsRepository from "../../repository/logsRepository";
import { RequestWithUser } from "../../middleware/types/express";
import {
  CreateLockerRequestDto,
  UpdateLockerRequestDto,
  toUpdateLockerData,
  toLockerResponseDto,
  toLockerListResponseDto,
  toLockerPageResponseDto,
} from "../../dto/locker.dto";

const lockerService = new LockerService(unitOfWork);

const logAdminAction = async (request: RequestWithUser, action: string) => {
  const admin = request.admin;
  await LogsRepository.logAction(
    admin!._id.toString(),
    `${admin!.first_name} ${admin?.last_name} ${action} at ${new Date().toISOString()}`,
  );
};

//RETRIEVE LOCKERS
export const getAllLockers = async (
  request: RequestWithUser,
  response: Response,
) => {
  try {
    const retrieveLockers = await lockerService.getAll();
    await logAdminAction(request, "requested locker list");
    return response.status(200).json(toLockerListResponseDto(retrieveLockers));
  } catch (error) {
    return response.status(500).json({ message: "Locker retrieval failed" });
  }
};

//RETRIEVE ACTIVE LOCKERS
export const getActiveLockers = async (
  request: RequestWithUser,
  response: Response,
) => {
  try {
    const retrieveActiveLockers = await lockerService.getByActiveStatus(false);
    await logAdminAction(request, "requested awaited locker list");
    return response.status(200).json(toLockerListResponseDto(retrieveActiveLockers ?? []));
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Locker retrieval failed" });
  }
};

//SEARCH / PAGINATE LOCKERS
export const searchLockers = async (
  request: RequestWithUser,
  response: Response,
) => {
  try {
    const limit = parseInt(request.query.limit as string) || 10;
    const page = parseInt(request.query.page as string) || 1;
    const search = (request.query.search as string) || "";

    const result = await lockerService.search(page, limit, search);
    await logAdminAction(request, "accessed lockers list");
    return response.status(200).json(toLockerPageResponseDto(result));
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Error fetching lockers" });
  }
};

//RETRIEVE AVAILABLE LOCKERS
export const getAvailableLockers = async (
  request: RequestWithUser,
  response: Response,
) => {
  try {
    const lockers = await lockerService.getAvailable();
    await logAdminAction(request, "requested active locker details");
    return response.status(200).json(toLockerListResponseDto(lockers));
  } catch (error) {
    return response.status(500).json({ message: "Locker retrieval failed" });
  }
};

//RETRIEVE LOCKER BY ID
export const getLockerById = async (
  request: RequestWithUser,
  response: Response,
) => {
  try {
    const locker = await lockerService.getById(request.params.id!);

    if (!locker) {
      return response.status(404).json({ message: "Locker not found" });
    }

    await logAdminAction(request, "requested locker details");
    return response.status(200).json(toLockerResponseDto(locker));
  } catch (error) {
    return response.status(500).json({ message: "Locker retrieval failed" });
  }
};

//CREATE LOCKER
export const createLocker = async (
  request: RequestWithUser,
  response: Response,
) => {
  try {
    const { lockerNumber } = request.body as CreateLockerRequestDto;

    if (!lockerNumber) {
      return response.status(500).json({ message: "Locker number is required!" });
    }

    await logAdminAction(request, "created new locker");
    const newLocker = await lockerService.create(lockerNumber);

    return response.status(201).json(toLockerResponseDto(newLocker));
  } catch (error) {
    return response.status(500).json({ message: "Locker creation failed" });
  }
};

//UPDATE LOCKER
export const updateLocker = async (
  request: RequestWithUser,
  response: Response,
) => {
  try {
    const locker = await lockerService.getById(request.params.id!);

    if (!locker) {
      return response.status(404).json({ message: "Locker not found" });
    }

    await logAdminAction(request, "updated locker");
    const updatedLocker = await lockerService.update(
      request.params.id!,
      toUpdateLockerData(request.body as UpdateLockerRequestDto),
    );

    return response.status(200).json(updatedLocker ? toLockerResponseDto(updatedLocker) : null);
  } catch (error) {
    return response.status(500).json({ message: "Locker cannot be updated" });
  }
};

//SOFT DELETE LOCKER
export const softDeleteLocker = async (
  request: RequestWithUser,
  response: Response,
) => {
  try {
    const locker = await lockerService.getById(request.params.id!);

    if (!locker) {
      return response.status(404).json({ message: "Locker not found" });
    }

    await logAdminAction(request, "deleted locker");
    await lockerService.deactivate(request.params.id!);
    return response.status(204).json({ message: "Locker successfully deleted" });
  } catch (error) {
    return response.status(500).json({ message: "Locker cannot be deleted" });
  }
};

//HARD DELETE LOCKER
export const deleteLocker = async (
  request: RequestWithUser,
  response: Response,
) => {
  try {
    const locker = await lockerService.getById(request.params.id!);

    if (!locker) {
      return response.status(404).json({ message: "Locker not found" });
    }

    await logAdminAction(request, "successfully deleted locker");
    await lockerService.delete(request.params.id!);
    return response.status(204).json({ message: "Locker successfully deleted" });
  } catch (error) {
    return response.status(500).json({ message: "Locker cannot be deleted" });
  }
};

import express, { Response as ExpressResponse } from "express";
import unitOfWork from "../repository/unitOfWork";
import { EquipmentService } from "../repository/services/equipmentService";
import LogsRepository from "../repository/logsRepository";
import { RequestWithUser } from "../middleware/types/express";
import { authMiddleware } from "../middleware/middleware";
import { validate, equipmentValidation } from "../utils/validation";
import {
  CreateEquipmentRequestDto,
  UpdateEquipmentRequestDto,
  toCreateEquipmentData,
  toUpdateEquipmentData,
  toEquipmentResponseDto,
  toEquipmentListResponseDto,
  toEquipmentPageResponseDto,
} from "../dto/equipment.dto";

const equipmentRouter = express.Router();
const equipmentService = new EquipmentService(unitOfWork);

//VIEW EQUIPMENT
equipmentRouter.get(
  "/",
  authMiddleware,
  async (Request: RequestWithUser, Response) => {
    try {
      const retrieveEquipment = await equipmentService.getAll();
      const admin = Request.admin;
      await LogsRepository.logAction(
        admin!._id.toString(),
        `${admin!.first_name} ${admin?.last_name} accessed equipment list at ${new Date().toISOString()}`,
      );
      return Response.status(200).json(toEquipmentListResponseDto(retrieveEquipment));
    } catch (error) {
      return Response.status(500).json({ message: "Equipment not retrieved!" });
    }
  },
);

//RETRIVE EQUIPMENT
equipmentRouter.get(
  "/show/",
  authMiddleware,
  async (request: RequestWithUser, response) => {
    try {
      const limit = parseInt(request.query.limit as string) || 10;
      const page = parseInt(request.query.page as string) || 1;
      const search = (request.query.search as string) || "";

      const result = await equipmentService.search(page, limit, search);

      const admin = request.admin;
      await LogsRepository.logAction(
        admin!._id.toString(),
        `${admin!.first_name} ${admin?.last_name} accessed customers list at ${new Date().toISOString()}`,
      );
      response.status(200).json(toEquipmentPageResponseDto(result));
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: "Error fetching customers" });
    }
  },
);

//RETRIEVE EQUIPMENT
equipmentRouter.get(
  "/:id",
  authMiddleware,
  async (Request: RequestWithUser, Response) => {
    try {
      const retrieveEquipment = await equipmentService.getById(Request.params.id!);

      if (!retrieveEquipment) {
        return Response.status(404).json("Failed to retrieve equipment");
      }

      const admin = Request.admin;
      await LogsRepository.logAction(
        admin!._id.toString(),
        `${admin!.first_name} ${admin?.last_name} accessed equipment at ${new Date().toISOString()}`,
      );

      return Response.status(200).json(toEquipmentResponseDto(retrieveEquipment));
    } catch (error) {
      return Response.status(500).json({ message: "Equipment not retrieved!" });
    }
  },
);

//CREATE EQUIPMENT
equipmentRouter.post(
  "/",
  authMiddleware,
  equipmentValidation,
  validate,
  async (Request: RequestWithUser, Response: ExpressResponse) => {
    try {
      const newEquipment = await equipmentService.create(toCreateEquipmentData(Request.body as CreateEquipmentRequestDto));
      const admin = Request.admin;
      await LogsRepository.logAction(
        admin!._id.toString(),
        `${admin!.first_name} ${admin?.last_name} created equipment at ${new Date().toISOString()}`,
      );
      return Response.status(200).json(toEquipmentResponseDto(newEquipment));
    } catch (error) {
      return Response.status(500).json({ message: "Equipment not created" });
    }
  },
);

//DELETE EQUIPMENT
equipmentRouter.delete(
  "/:id",
  authMiddleware,
  async (Request: RequestWithUser, Response) => {
    try {
      const id = Request.params.id!;
      const deleteEquipment = await equipmentService.delete(id);

      if (!deleteEquipment) {
        return Response.status(404).json({
          message: "Failed to delete equipment",
        });
      }

      const admin = Request.admin;
      await LogsRepository.logAction(
        admin!._id.toString(),
        `${admin!.first_name} ${admin?.last_name} deleted equipment at ${new Date().toISOString()}`,
      );
      return Response.status(204).json({
        message: "Equipment deleted succesfully",
      });
    } catch (error) {
      return Response.status(500).json({ message: "Delete equipment failed!" });
    }
  },
);

//UPDATe EQUIPMENT
equipmentRouter.put(
  "/:id",
  authMiddleware,
  equipmentValidation,
  validate,
  async (Request: RequestWithUser, Response: ExpressResponse) => {
    try {
      const id = Request.params.id!;
      const updateEquiment = await equipmentService.update(id, toUpdateEquipmentData(Request.body as UpdateEquipmentRequestDto));

      if (!updateEquiment) {
        return Response.status(404).json({
          message: "Failed to update equipment",
        });
      }

      const admin = Request.admin;
      await LogsRepository.logAction(
        admin!._id.toString(),
        `${admin!.first_name} ${admin?.last_name} updated equipment at ${new Date().toISOString()}`,
      );
      return Response.status(200).json(toEquipmentResponseDto(updateEquiment));
    } catch (error) {
      return Response.status(500).json({ message: "Delete equipment failed!" });
    }
  },
);

export default equipmentRouter;

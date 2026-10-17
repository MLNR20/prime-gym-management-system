import { Response } from "express";
import equipmentRepository from "../../repository/equipmentRepository";
import LogsRepository from "../../repository/logsRepository";
import { RequestWithUser } from "../../middleware/types/express";

const logAdminAction = async (request: RequestWithUser, action: string) => {
  const admin = request.admin;
  await LogsRepository.logAction(
    admin!._id.toString(),
    `${admin!.first_name} ${admin?.last_name} ${action} at ${new Date().toISOString()}`,
  );
};

//VIEW EQUIPMENT
export const getAllEquipment = async (
  request: RequestWithUser,
  response: Response,
) => {
  try {
    const retrieveEquipment = await equipmentRepository.findAll();
    await logAdminAction(request, "accessed equipment list");
    return response.status(200).json(retrieveEquipment);
  } catch (error) {
    return response.status(500).json({ message: "Equipment not retrieved!" });
  }
};

//SEARCH / PAGINATE EQUIPMENT
export const searchEquipment = async (
  request: RequestWithUser,
  response: Response,
) => {
  try {
    const limit = parseInt(request.query.limit as string) || 10;
    const page = parseInt(request.query.page as string) || 1;
    const search = (request.query.search as string) || "";

    const result = await equipmentRepository.search({
      page,
      limit,
      search,
      fields: ["equipment_name"],
    });

    await logAdminAction(request, "accessed equipment list");
    return response.status(200).json(result);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Error fetching customers" });
  }
};

//RETRIEVE EQUIPMENT
export const getEquipmentById = async (
  request: RequestWithUser,
  response: Response,
) => {
  try {
    const retrieveEquipment = await equipmentRepository.findById(
      request.params.id!,
    );

    if (!retrieveEquipment) {
      return response.status(404).json("Failed to retrieve equipment");
    }

    await logAdminAction(request, "accessed equipment");
    return response.status(200).json(retrieveEquipment);
  } catch (error) {
    return response.status(500).json({ message: "Equipment not retrieved!" });
  }
};

//CREATE EQUIPMENT
export const createEquipment = async (
  request: RequestWithUser,
  response: Response,
) => {
  try {
    const newEquipment = await equipmentRepository.create(request.body);
    await logAdminAction(request, "created equipment");
    return response.status(200).json(newEquipment);
  } catch (error) {
    return response.status(500).json({ message: "Equipment not created" });
  }
};

//UPDATE EQUIPMENT
export const updateEquipment = async (
  request: RequestWithUser,
  response: Response,
) => {
  try {
    const id = request.params.id!;
    const updatedEquipment = await equipmentRepository.update(id, request.body);

    if (!updatedEquipment) {
      return response.status(404).json({
        message: "Failed to update equipment",
      });
    }

    await logAdminAction(request, "updated equipment");
    return response.status(200).json(updatedEquipment);
  } catch (error) {
    return response.status(500).json({ message: "Delete equipment failed!" });
  }
};

//DELETE EQUIPMENT
export const deleteEquipment = async (
  request: RequestWithUser,
  response: Response,
) => {
  try {
    const id = request.params.id!;
    const deletedEquipment = await equipmentRepository.delete(id);

    if (!deletedEquipment) {
      return response.status(404).json({
        message: "Failed to delete equipment",
      });
    }

    await logAdminAction(request, "deleted equipment");
    return response.status(204).json({
      message: "Equipment deleted succesfully",
    });
  } catch (error) {
    return response.status(500).json({ message: "Delete equipment failed!" });
  }
};

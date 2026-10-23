import express, { Response } from "express";
import unitOfWork from "../repository/unitOfWork";
import { SalesService } from "../repository/services/salesService";
import LogsRepository from "../repository/logsRepository";
import { RequestWithUser } from "../middleware/types/express";
import { authMiddleware } from "../middleware/middleware";
import { validate, createSalesValidation, updateSalesValidation } from "../utils/validation";

const salesRouter = express.Router();
const salesService = new SalesService(unitOfWork);

salesRouter.get(
  "/show/",
  authMiddleware,
  async (request: RequestWithUser, response) => {
    try {
      const limit = parseInt(request.query.limit as string) || 10;
      const page = parseInt(request.query.page as string) || 1;
      const search = (request.query.search as string) || "";
      const customerId = (request.query.customerId as string) || "";

      const result = await salesService.search(page, limit, search, customerId);

      const admin = request.admin;
      await LogsRepository.logAction(
        admin!._id.toString(),
        `${admin!.first_name} ${admin?.last_name} accessed sales list at ${new Date().toISOString()}`
      );

      response.status(200).json(result);
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: "Error fetching sales" });
    }
  }
);

salesRouter.get(
  "/",
  authMiddleware,
  async (request: RequestWithUser, response) => {
    try {
      const sales = await salesService.getAll();
      return response.status(200).json(sales);
    } catch (error) {
      return response.status(500).json({ message: "Sales not retrieved!" });
    }
  }
);

salesRouter.get(
  "/customer/:id",
  authMiddleware,
  async (request: RequestWithUser, response) => {
    try {
      const customerId = request.params.id;
      if (!customerId) {
        return response.status(400).json({ message: "Customer id is required" });
      }

      const limit = parseInt(request.query.limit as string) || 10;
      const sales = await salesService.getByCustomerId(customerId, limit);

      return response.status(200).json(sales);
    } catch (error) {
      return response.status(500).json({ message: "Error fetching customer sales" });
    }
  }
);

salesRouter.get(
  "/:id",
  authMiddleware,
  async (request: RequestWithUser, response) => {
    try {
      const { id } = request.params;
      if (!id) {
        return response.status(400).json({ message: "Sale id is required" });
      }

      const sale = await salesService.getById(id);
      if (!sale) {
        return response.status(404).json({ message: "Sale not found" });
      }

      const admin = request.admin;
      await LogsRepository.logAction(
        admin!._id.toString(),
        `${admin!.first_name} ${admin?.last_name} accessed sale record at ${new Date().toISOString()}`
      );

      return response.status(200).json(sale);
    } catch (error) {
      return response.status(500).json({ message: "Sale not retrieved!" });
    }
  }
);

salesRouter.post(
  "/",
  authMiddleware,
  createSalesValidation,
  validate,
  async (request: RequestWithUser, response: Response) => {
    try {
      const { customer_id, inventory_id, quantity } = request.body;

      const newSale = await salesService.createSale({ customer_id, inventory_id, quantity });

      const admin = request.admin;
      await LogsRepository.logAction(
        admin!._id.toString(),
        `${admin!.first_name} ${admin?.last_name} created sale for inventory ${inventory_id} at ${new Date().toISOString()}`
      );

      return response.status(201).json(newSale);
    } catch (error: any) {
      return response.status(400).json({ message: error.message ?? "Sale not created" });
    }
  }
);

salesRouter.put(
  "/:id",
  authMiddleware,
  updateSalesValidation,
  validate,
  async (request: RequestWithUser, response: Response) => {
    try {
      const { id } = request.params;
      if (!id) {
        return response.status(400).json({ message: "Sale id is required" });
      }

      const updatedSale = await salesService.updateSale(id, request.body);
      if (!updatedSale) {
        return response.status(404).json({ message: "Sale not found" });
      }

      const admin = request.admin;
      await LogsRepository.logAction(
        admin!._id.toString(),
        `${admin!.first_name} ${admin?.last_name} updated sale at ${new Date().toISOString()}`
      );

      return response.status(200).json(updatedSale);
    } catch (error: any) {
      return response.status(400).json({ message: error.message ?? "Failed to update sale" });
    }
  }
);

salesRouter.delete(
  "/:id",
  authMiddleware,
  async (request: RequestWithUser, response) => {
    try {
      const { id } = request.params;
      if (!id) {
        return response.status(400).json({ message: "Sale id is required" });
      }

      const deletedSale = await salesService.deleteSale(id);
      if (!deletedSale) {
        return response.status(404).json({ message: "Sale not found" });
      }

      const admin = request.admin;
      await LogsRepository.logAction(
        admin!._id.toString(),
        `${admin!.first_name} ${admin?.last_name} deleted sale at ${new Date().toISOString()}`
      );

      return response.status(204).json({ message: "Sale deleted successfully" });
    } catch (error: any) {
      return response.status(400).json({ message: error.message ?? "Failed to delete sale" });
    }
  }
);

export default salesRouter;

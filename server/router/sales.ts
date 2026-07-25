import express from "express";
import salesRepository from "../repository/salesRepository";
import inventoryRepository from "../repository/inventoryRepository";
import customerRepository from "../repository/customerRepository";
import salesService from "../repository/services/salesService";
import LogsRepository from "../repository/logsRepository";
import { RequestWithUser } from "../middleware/types/express";
import { authMiddleware } from "../middleware/middleware";

const salesRouter = express.Router();

async function enrichSalesWithInventory(sales: any[]) {
  return Promise.all(
    sales.map(async (sale) => {
      const item = await inventoryRepository.findById(sale.inventory_id);
      const customer = sale.customer_id
        ? await customerRepository.findById(sale.customer_id)
        : null;
      return {
        ...sale,
        item_name: item?.item_name ?? "Unknown",
        item_code: item?.item_code ?? "",
        first_name: customer?.first_name ?? "N/A",
        last_name: customer?.last_name ?? "",
      };
    })
  );
}

salesRouter.get(
  "/show/",
  authMiddleware,
  async (request: RequestWithUser, response) => {
    try {
      const limit = parseInt(request.query.limit as string) || 10;
      const page = parseInt(request.query.page as string) || 1;
      const search = (request.query.search as string) || "";
      const customerId = (request.query.customerId as string) || "";

      const result = await salesRepository.search({
        page,
        limit,
        search,
        fields: ["inventory_id"],
        filter: customerId ? { customer_id: customerId } : {},
      });

      const enrichedData = await enrichSalesWithInventory(result.data);

      const admin = request.admin;
      await LogsRepository.logAction(
        admin!._id.toString(),
        `${admin!.first_name} ${admin?.last_name} accessed sales list at ${new Date().toISOString()}`
      );

      response.status(200).json({ ...result, data: enrichedData });
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
      const sales = await salesRepository.findAll();
      const enriched = await enrichSalesWithInventory(
        sales.map((s) => (s.toObject ? s.toObject() : s))
      );
      return response.status(200).json(enriched);
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
      const sales = await salesRepository.findByCustomerId(customerId, limit);
      const enriched = await enrichSalesWithInventory(
        sales.map((s) => (s.toObject ? s.toObject() : s))
      );

      return response.status(200).json(enriched);
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

      const sale = await salesRepository.findById(id);
      if (!sale) {
        return response.status(404).json({ message: "Sale not found" });
      }

      const item = await inventoryRepository.findById(sale.inventory_id);
      const enriched = {
        ...(sale.toObject ? sale.toObject() : sale),
        item_name: item?.item_name ?? "Unknown",
        item_code: item?.item_code ?? "",
        unit_price: item?.unit_price ?? 0,
      };

      const admin = request.admin;
      await LogsRepository.logAction(
        admin!._id.toString(),
        `${admin!.first_name} ${admin?.last_name} accessed sale record at ${new Date().toISOString()}`
      );

      return response.status(200).json(enriched);
    } catch (error) {
      return response.status(500).json({ message: "Sale not retrieved!" });
    }
  }
);

salesRouter.post(
  "/",
  authMiddleware,
  async (request: RequestWithUser, response) => {
    try {
      const { customer_id, inventory_id, quantity } = request.body;

      if (!customer_id) {
        return response.status(400).json({ message: "Customer is required" });
      }
      if (!inventory_id) {
        return response.status(400).json({ message: "Inventory item is required" });
      }
      if (!quantity || quantity < 1) {
        return response.status(400).json({ message: "Valid quantity is required" });
      }

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
  async (request: RequestWithUser, response) => {
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

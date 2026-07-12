import express from "express";
import inventoryRepository from "../repository/inventoryRepository";
import LogsRepository from "../repository/logsRepository";
import { RequestWithUser } from "../middleware/types/express";
import { authMiddleware } from "../middleware/middleware";

const inventoryRouter = express.Router();

// VIEW ALL INVENTORY (paginated + searchable)
inventoryRouter.get(
  "/show/",
  authMiddleware,
  async (request: RequestWithUser, response) => {
    try {
      const limit = parseInt(request.query.limit as string) || 10;
      const page = parseInt(request.query.page as string) || 1;
      const search = (request.query.search as string) || "";

      const result = await inventoryRepository.search({
        page,
        limit,
        search,
        fields: ["item_name", "item_code", "category"],
      });

      const admin = request.admin;
      await LogsRepository.logAction(
        admin!._id.toString(),
        `${admin!.first_name} ${admin?.last_name} accessed inventory list at ${new Date().toISOString()}`,
      );
      response.status(200).json(result);
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: "Error fetching inventory" });
    }
  },
);

// GET ALL INVENTORY
inventoryRouter.get(
  "/",
  authMiddleware,
  async (request: RequestWithUser, response) => {
    try {
      const inventory = await inventoryRepository.findAll();
      return response.status(200).json(inventory);
    } catch (error) {
      return response.status(500).json({ message: "Inventory not retrieved!" });
    }
  },
);

// GET INVENTORY ITEMS AVAILABLE FOR SALE
inventoryRouter.get(
  "/for-sale",
  authMiddleware,
  async (_request: RequestWithUser, response) => {
    try {
      const items = await inventoryRepository.findAll();
      const forSale = items.filter(
        (item) => item.is_for_sale && item.quantity > 0
      );
      return response.status(200).json(forSale);
    } catch (error) {
      return response.status(500).json({ message: "For-sale inventory not retrieved!" });
    }
  },
);

// GET SINGLE INVENTORY ITEM
inventoryRouter.get(
  "/:id",
  authMiddleware,
  async (request: RequestWithUser, response) => {
    try {
      const { id } = request.params;
      if (!id) {
        return response.status(400).json({ message: "Inventory item id is required" });
      }

      const item = await inventoryRepository.findById(id);

      if (!item) {
        return response.status(404).json({ message: "Inventory item not found" });
      }

      const admin = request.admin;
      await LogsRepository.logAction(
        admin!._id.toString(),
        `${admin!.first_name} ${admin?.last_name} accessed inventory item at ${new Date().toISOString()}`,
      );
      return response.status(200).json(item);
    } catch (error) {
      return response.status(500).json({ message: "Inventory item not retrieved!" });
    }
  },
);

// CREATE INVENTORY ITEM
inventoryRouter.post(
  "/",
  authMiddleware,
  async (request: RequestWithUser, response) => {
    try {
      const newItem = await inventoryRepository.create(request.body);

      const admin = request.admin;
      await LogsRepository.logAction(
        admin!._id.toString(),
        `${admin!.first_name} ${admin?.last_name} created inventory item "${newItem.item_name}" at ${new Date().toISOString()}`,
      );
      return response.status(201).json(newItem);
    } catch (error) {
      return response.status(500).json({ message: "Inventory item not created" });
    }
  },
);

// UPDATE INVENTORY ITEM
inventoryRouter.put(
  "/:id",
  authMiddleware,
  async (request: RequestWithUser, response) => {
    try {
      const { id } = request.params;
      if (!id) {
        return response.status(400).json({ message: "Inventory item id is required" });
      }

      const updatedItem = await inventoryRepository.update(id, {
        ...request.body,
        updatedAt: new Date(),
      });

      if (!updatedItem) {
        return response.status(404).json({ message: "Inventory item not found" });
      }

      const admin = request.admin;
      await LogsRepository.logAction(
        admin!._id.toString(),
        `${admin!.first_name} ${admin?.last_name} updated inventory item at ${new Date().toISOString()}`,
      );
      return response.status(200).json(updatedItem);
    } catch (error) {
      return response.status(500).json({ message: "Failed to update inventory item" });
    }
  },
);

// DELETE INVENTORY ITEM
inventoryRouter.delete(
  "/:id",
  authMiddleware,
  async (request: RequestWithUser, response) => {
    try {
      const { id } = request.params;
      if (!id) {
        return response.status(400).json({ message: "Inventory item id is required" });
      }

      const deletedItem = await inventoryRepository.delete(id);

      if (!deletedItem) {
        return response.status(404).json({ message: "Inventory item not found" });
      }

      const admin = request.admin;
      await LogsRepository.logAction(
        admin!._id.toString(),
        `${admin!.first_name} ${admin?.last_name} deleted inventory item at ${new Date().toISOString()}`,
      );
      return response.status(204).json({ message: "Inventory item deleted successfully" });
    } catch (error) {
      return response.status(500).json({ message: "Failed to delete inventory item" });
    }
  },
);

export default inventoryRouter;
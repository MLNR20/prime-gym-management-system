import Inventory, { IInventoryDocument } from "../models/inventory";
import GenericRepository from "./genericRepository";
import { IInventoryRepository } from "./interface/inventoryRepositoryInterface";

export class InventoryRepository
  extends GenericRepository<IInventoryDocument>
  implements IInventoryRepository {}

export default new InventoryRepository(Inventory);

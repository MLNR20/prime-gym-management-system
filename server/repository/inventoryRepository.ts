import Inventory, { IInventoryDocument } from "../models/inventory";
import GenericRepository from "./genericRepository";
import { IInventoryRepository } from "./interface/inventoryRepositoryInterface";

export class InventoryRepository
  extends GenericRepository<IInventoryDocument>
  implements IInventoryRepository
{
  async findByItemCode(item_code: string): Promise<IInventoryDocument | null> {
    return this.model.findOne({ item_code }).session(this.dbSession);
  }
}

export default new InventoryRepository(Inventory);

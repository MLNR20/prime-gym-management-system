import { IInventory } from "../../models/inventory";

export interface IInventoryRepository {
  findByItemCode(item_code: string): Promise<IInventory | null>;
}

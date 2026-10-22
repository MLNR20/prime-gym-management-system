import { IInventoryDocument } from "../../models/inventory";
import { IUnitOfWork } from "../unitOfWork";

const SEARCH_FIELDS = ["item_name", "item_code", "category"];

export class InventoryService {
  private unitOfWork: IUnitOfWork;

  constructor(unitOfWork: IUnitOfWork) {
    this.unitOfWork = unitOfWork;
  }

  async getAll() {
    return this.unitOfWork.inventory.findAll();
  }

  async getForSale() {
    const items = await this.unitOfWork.inventory.findAll();
    return items.filter((item) => item.is_for_sale && item.quantity > 0);
  }

  async search(page: number, limit: number, search: string) {
    return this.unitOfWork.inventory.search({ page, limit, search, fields: SEARCH_FIELDS });
  }

  async getById(id: string) {
    return this.unitOfWork.inventory.findById(id);
  }

  async create(data: Partial<IInventoryDocument>) {
    return this.unitOfWork.inventory.create(data);
  }

  async update(id: string, data: Partial<IInventoryDocument>) {
    return this.unitOfWork.inventory.update(id, { ...data, updatedAt: new Date() });
  }

  async delete(id: string) {
    return this.unitOfWork.inventory.delete(id);
  }
}

import { IInventoryDocument } from "../../models/inventory";
import { IUnitOfWork } from "../unitOfWork";

const SEARCH_FIELDS = ["item_name", "item_code", "category"];
const DUPLICATE_KEY_ERROR_CODE = 11000;

export class DuplicateItemCodeError extends Error {
  constructor(item_code: string) {
    super(`Item code "${item_code}" already exists`);
    this.name = "DuplicateItemCodeError";
  }
}

const isDuplicateKeyError = (error: unknown): boolean =>
  (error as { code?: number } | null)?.code === DUPLICATE_KEY_ERROR_CODE;

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

  // The unique index is the source of truth; the lookup gives a clear error up front
  // and the key-error catch covers two requests racing with the same code.
  private async assertItemCodeAvailable(item_code: string | undefined, ownId?: string) {
    if (!item_code) return;
    const existing = await this.unitOfWork.inventory.findByItemCode(item_code.trim());
    if (existing && String(existing._id) !== ownId) throw new DuplicateItemCodeError(item_code.trim());
  }

  async create(data: Partial<IInventoryDocument>) {
    await this.assertItemCodeAvailable(data.item_code);
    try {
      return await this.unitOfWork.inventory.create(data);
    } catch (error) {
      if (isDuplicateKeyError(error)) throw new DuplicateItemCodeError(String(data.item_code));
      throw error;
    }
  }

  async update(id: string, data: Partial<IInventoryDocument>) {
    await this.assertItemCodeAvailable(data.item_code, id);
    try {
      return await this.unitOfWork.inventory.update(id, { ...data, updatedAt: new Date() });
    } catch (error) {
      if (isDuplicateKeyError(error)) throw new DuplicateItemCodeError(String(data.item_code));
      throw error;
    }
  }

  async delete(id: string) {
    return this.unitOfWork.inventory.delete(id);
  }
}

import { ISalesDocument } from "../../models/sales";
import { IInventoryDocument } from "../../models/inventory";
import { IUnitOfWork, Repositories } from "../unitOfWork";

export class SalesService {
  private unitOfWork: IUnitOfWork;

  constructor(unitOfWork: IUnitOfWork) {
    this.unitOfWork = unitOfWork;
  }

  private resolveStatus(quantity: number, currentStatus: string): string {
    if (quantity === 0) return "Out of Stock";
    if (currentStatus === "Out of Stock" && quantity > 0) return "Available";
    return currentStatus;
  }

  private async findInventoryOrThrow(repositories: Repositories, inventoryId: string): Promise<IInventoryDocument> {
    const inventory = await repositories.inventory.findById(inventoryId);
    if (!inventory) {
      throw new Error("Inventory item not found");
    }
    return inventory;
  }

  private async setInventoryQuantity(repositories: Repositories, inventory: IInventoryDocument, quantity: number) {
    await repositories.inventory.update(String(inventory._id), {
      quantity,
      status: this.resolveStatus(quantity, inventory.status),
      updatedAt: new Date(),
    });
  }

  private async enrich(sales: any[]) {
    const { inventory, customers } = this.unitOfWork;
    return Promise.all(
      sales.map(async (sale) => {
        const item = await inventory.findById(sale.inventory_id);
        const customer = sale.customer_id ? await customers.findById(sale.customer_id) : null;
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

  private toPlain(sale: ISalesDocument) {
    return sale.toObject ? sale.toObject() : sale;
  }

  async search(page: number, limit: number, search: string, customerId: string) {
    const result = await this.unitOfWork.sales.search({
      page,
      limit,
      search,
      fields: ["inventory_id"],
      filter: customerId ? { customer_id: customerId } : {},
    });
    return { ...result, data: await this.enrich(result.data) };
  }

  async getAll() {
    const sales = await this.unitOfWork.sales.findAll();
    return this.enrich(sales.map((sale) => this.toPlain(sale)));
  }

  async getByCustomerId(customerId: string, limit: number) {
    const sales = await this.unitOfWork.sales.findByCustomerId(customerId, limit);
    return this.enrich(sales.map((sale) => this.toPlain(sale)));
  }

  async getById(saleId: string) {
    const sale = await this.unitOfWork.sales.findById(saleId);
    if (!sale) return null;

    const item = await this.unitOfWork.inventory.findById(sale.inventory_id);
    return {
      ...this.toPlain(sale),
      item_name: item?.item_name ?? "Unknown",
      item_code: item?.item_code ?? "",
      unit_price: item?.unit_price ?? 0,
    };
  }

  async createSale(data: { customer_id: string; inventory_id: string; quantity: number }): Promise<ISalesDocument> {
    return this.unitOfWork.run(async (repositories) => {
      const customer = await repositories.customers.findById(data.customer_id);
      if (!customer) {
        throw new Error("Customer not found");
      }

      const inventory = await this.findInventoryOrThrow(repositories, data.inventory_id);

      if (!inventory.is_for_sale) {
        throw new Error("This item is not marked for sale");
      }

      if (inventory.quantity < data.quantity) {
        throw new Error("Insufficient stock for this sale");
      }

      await this.setInventoryQuantity(repositories, inventory, inventory.quantity - data.quantity);

      return repositories.sales.create({
        customer_id: data.customer_id,
        inventory_id: data.inventory_id,
        quantity: data.quantity,
        total_price: data.quantity * inventory.unit_price,
        is_active: true,
      });
    });
  }

  async updateSale(
    saleId: string,
    data: { inventory_id?: string; quantity?: number; is_active?: boolean }
  ): Promise<ISalesDocument | null> {
    return this.unitOfWork.run(async (repositories) => {
      const sale = await repositories.sales.findById(saleId);
      if (!sale) {
        throw new Error("Sale not found");
      }

      const nextInventoryId = data.inventory_id ?? sale.inventory_id;
      const nextQuantity = data.quantity ?? sale.quantity;

      if (nextQuantity < 1) {
        throw new Error("Sale quantity must be at least 1");
      }

      if (nextInventoryId !== sale.inventory_id) {
        const oldInventory = await this.findInventoryOrThrow(repositories, sale.inventory_id);
        const newInventory = await this.findInventoryOrThrow(repositories, nextInventoryId);

        if (!newInventory.is_for_sale) {
          throw new Error("This item is not marked for sale");
        }
        if (newInventory.quantity < nextQuantity) {
          throw new Error("Insufficient stock for this sale");
        }

        await this.setInventoryQuantity(repositories, oldInventory, oldInventory.quantity + sale.quantity);
        await this.setInventoryQuantity(repositories, newInventory, newInventory.quantity - nextQuantity);

        return repositories.sales.update(saleId, {
          inventory_id: nextInventoryId,
          quantity: nextQuantity,
          total_price: nextQuantity * newInventory.unit_price,
          is_active: data.is_active ?? sale.is_active,
          updatedAt: new Date(),
        });
      }

      const inventory = await this.findInventoryOrThrow(repositories, sale.inventory_id);

      const quantityDiff = nextQuantity - sale.quantity;
      if (quantityDiff > 0 && inventory.quantity < quantityDiff) {
        throw new Error("Insufficient stock for this sale");
      }
      if (quantityDiff !== 0) {
        await this.setInventoryQuantity(repositories, inventory, inventory.quantity - quantityDiff);
      }

      return repositories.sales.update(saleId, {
        quantity: nextQuantity,
        total_price: nextQuantity * inventory.unit_price,
        is_active: data.is_active ?? sale.is_active,
        updatedAt: new Date(),
      });
    });
  }

  async deleteSale(saleId: string): Promise<ISalesDocument | null> {
    return this.unitOfWork.run(async (repositories) => {
      const sale = await repositories.sales.findById(saleId);
      if (!sale) {
        throw new Error("Sale not found");
      }

      const inventory = await this.findInventoryOrThrow(repositories, sale.inventory_id);
      await this.setInventoryQuantity(repositories, inventory, inventory.quantity + sale.quantity);

      return repositories.sales.delete(saleId);
    });
  }
}

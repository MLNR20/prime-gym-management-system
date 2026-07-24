import inventoryRepository from "../inventoryRepository";
import salesRepository from "../salesRepository";
import customerRepository from "../customerRepository";
import { ISalesDocument } from "../../models/sales";
import { IInventoryDocument } from "../../models/inventory";

export class SalesService {
  private resolveStatus(quantity: number, currentStatus: string): string {
    if (quantity === 0) return "Out of Stock";
    if (currentStatus === "Out of Stock" && quantity > 0) return "Available";
    return currentStatus;
  }

  private async findInventoryOrThrow(inventoryId: string): Promise<IInventoryDocument> {
    const inventory = await inventoryRepository.findById(inventoryId);
    if (!inventory) {
      throw new Error("Inventory item not found");
    }
    return inventory;
  }

  async createSale(data: { customer_id: string; inventory_id: string; quantity: number }): Promise<ISalesDocument> {
    const customer = await customerRepository.findById(data.customer_id);
    if (!customer) {
      throw new Error("Customer not found");
    }

    const inventory = await this.findInventoryOrThrow(data.inventory_id);

    if (!inventory.is_for_sale) {
      throw new Error("This item is not marked for sale");
    }

    if (inventory.quantity < data.quantity) {
      throw new Error("Insufficient stock for this sale");
    }

    const newQuantity = inventory.quantity - data.quantity;

    await inventoryRepository.update(data.inventory_id, {
      quantity: newQuantity,
      status: this.resolveStatus(newQuantity, inventory.status),
      updatedAt: new Date(),
    });

    const total_price = data.quantity * inventory.unit_price;

    return salesRepository.create({
      customer_id: data.customer_id,
      inventory_id: data.inventory_id,
      quantity: data.quantity,
      total_price,
      is_active: true,
    });
  }

  async updateSale(
    saleId: string,
    data: { inventory_id?: string; quantity?: number; is_active?: boolean }
  ): Promise<ISalesDocument | null> {
    const sale = await salesRepository.findById(saleId);
    if (!sale) {
      throw new Error("Sale not found");
    }

    const nextInventoryId = data.inventory_id ?? sale.inventory_id;
    const nextQuantity = data.quantity ?? sale.quantity;

    if (nextQuantity < 1) {
      throw new Error("Sale quantity must be at least 1");
    }

    if (nextInventoryId !== sale.inventory_id) {
      const oldInventory = await this.findInventoryOrThrow(sale.inventory_id);
      await inventoryRepository.update(sale.inventory_id, {
        quantity: oldInventory.quantity + sale.quantity,
        status: this.resolveStatus(oldInventory.quantity + sale.quantity, oldInventory.status),
        updatedAt: new Date(),
      });

      const newInventory = await this.findInventoryOrThrow(nextInventoryId);
      if (!newInventory.is_for_sale) {
        throw new Error("This item is not marked for sale");
      }
      if (newInventory.quantity < nextQuantity) {
        throw new Error("Insufficient stock for this sale");
      }

      const newQuantity = newInventory.quantity - nextQuantity;
      await inventoryRepository.update(nextInventoryId, {
        quantity: newQuantity,
        status: this.resolveStatus(newQuantity, newInventory.status),
        updatedAt: new Date(),
      });

      return salesRepository.update(saleId, {
        inventory_id: nextInventoryId,
        quantity: nextQuantity,
        total_price: nextQuantity * newInventory.unit_price,
        is_active: data.is_active ?? sale.is_active,
        updatedAt: new Date(),
      });
    }

    const quantityDiff = nextQuantity - sale.quantity;
    if (quantityDiff !== 0) {
      const inventory = await this.findInventoryOrThrow(sale.inventory_id);

      if (quantityDiff > 0) {
        if (inventory.quantity < quantityDiff) {
          throw new Error("Insufficient stock for this sale");
        }
        const newQuantity = inventory.quantity - quantityDiff;
        await inventoryRepository.update(sale.inventory_id, {
          quantity: newQuantity,
          status: this.resolveStatus(newQuantity, inventory.status),
          updatedAt: new Date(),
        });
      } else {
        const newQuantity = inventory.quantity + Math.abs(quantityDiff);
        await inventoryRepository.update(sale.inventory_id, {
          quantity: newQuantity,
          status: this.resolveStatus(newQuantity, inventory.status),
          updatedAt: new Date(),
        });
      }
    }

    const inventory = await this.findInventoryOrThrow(sale.inventory_id);

    return salesRepository.update(saleId, {
      quantity: nextQuantity,
      total_price: nextQuantity * inventory.unit_price,
      is_active: data.is_active ?? sale.is_active,
      updatedAt: new Date(),
    });
  }

  async deleteSale(saleId: string): Promise<ISalesDocument | null> {
    const sale = await salesRepository.findById(saleId);
    if (!sale) {
      throw new Error("Sale not found");
    }

    const inventory = await this.findInventoryOrThrow(sale.inventory_id);
    const restoredQuantity = inventory.quantity + sale.quantity;

    await inventoryRepository.update(sale.inventory_id, {
      quantity: restoredQuantity,
      status: this.resolveStatus(restoredQuantity, inventory.status),
      updatedAt: new Date(),
    });

    return salesRepository.delete(saleId);
  }
}

export default new SalesService();

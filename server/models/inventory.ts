import { Schema, model, Document } from "mongoose";

export interface IInventory {
  item_name: string;
  item_code: string;
  category: string;
  quantity: number;
  unit_price: number;
  status: string;
  is_for_sale: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInventoryDocument extends IInventory, Document {}

enum InventoryCategory {
  equipment = "Equipment",
  supplements = "Supplements",
  apparel = "Apparel",
  accessories = "Accessories",
  cleaning = "Cleaning Supplies",
  miscellaneous = "Miscellaneous",
}

enum InventoryStatus {
  available = "Available",
  low_stock = "Low Stock",
  out_of_stock = "Out of Stock",
  discontinued = "Discontinued",
}

const inventorySchema = new Schema<IInventoryDocument>(
  {
    item_name: { type: String, required: true, trim: true },
    item_code: { type: String, required: true, trim: true, unique: true },
    category: {
      type: String,
      enum: Object.values(InventoryCategory),
      required: true,
      trim: true,
    },
    quantity: { type: Number, required: true, min: 0 },
    unit_price: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: Object.values(InventoryStatus),
      default: InventoryStatus.available,
      trim: true,
    },
    is_for_sale: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "Inventory" }
);

const Inventory = model<IInventoryDocument>("Inventory", inventorySchema);

export default Inventory;

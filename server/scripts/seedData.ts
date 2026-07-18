import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import databaseConnectionString from "../config/config";
import Inventory from "../models/inventory";
import Sales from "../models/sales";
import Customer from "../models/customer";

const CATEGORIES = ["Equipment", "Supplements", "Apparel", "Accessories", "Cleaning Supplies", "Miscellaneous"];
const STATUSES = ["Available", "Low Stock", "Out of Stock", "Discontinued"];

const ITEM_NAMES: Record<string, string[]> = {
  Equipment: ["Dumbbell Set", "Barbell", "Kettlebell", "Yoga Mat", "Resistance Band", "Bench Press"],
  Supplements: ["Whey Protein", "Creatine", "BCAA", "Pre-Workout", "Multivitamin", "Fish Oil"],
  Apparel: ["Gym Shirt", "Training Shorts", "Compression Sleeve", "Gym Socks", "Sports Bra"],
  Accessories: ["Shaker Bottle", "Lifting Straps", "Gym Gloves", "Wrist Wraps", "Gym Bag"],
  "Cleaning Supplies": ["Disinfectant Spray", "Sanitizing Wipes", "Towel Roll", "Floor Cleaner"],
  Miscellaneous: ["Water Bottle", "Locker Key Tag", "First Aid Kit", "Chalk Block"],
};

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFrom<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)] as T;
}

function randomDateWithin(days: number): Date {
  const now = Date.now();
  const past = now - randomInt(0, days) * 24 * 60 * 60 * 1000;
  return new Date(past);
}

async function seedInventory(count: number) {
  const docs = [];
  for (let i = 0; i < count; i++) {
    const category = randomFrom(CATEGORIES);
    const name = randomFrom(ITEM_NAMES[category] as string[]);
    const quantity = randomInt(0, 100);
    const status =
      quantity === 0 ? "Out of Stock" : quantity < 10 ? "Low Stock" : randomFrom(STATUSES.filter((s) => s !== "Out of Stock"));
    docs.push({
      item_name: name,
      item_code: `SKU-${(1000 + i).toString()}`,
      category,
      quantity,
      unit_price: randomInt(50, 3000),
      status,
      is_for_sale: Math.random() > 0.2,
      createdAt: randomDateWithin(180),
      updatedAt: new Date(),
    });
  }
  const inserted = await Inventory.insertMany(docs);
  console.log(`Inserted ${inserted.length} inventory records.`);
  return inserted;
}

async function seedSales(count: number, inventoryItems: any[]) {
  const forSaleItems = inventoryItems.filter((i) => i.is_for_sale);
  const pool = forSaleItems.length > 0 ? forSaleItems : inventoryItems;

  const docs = [];
  for (let i = 0; i < count; i++) {
    const item = randomFrom(pool);
    const quantity = randomInt(1, 5);
    const createdAt = randomDateWithin(180);
    docs.push({
      inventory_id: item._id.toString(),
      quantity,
      total_price: quantity * item.unit_price,
      is_active: true,
      createdAt,
      updatedAt: createdAt,
    });
  }
  const inserted = await Sales.insertMany(docs);
  console.log(`Inserted ${inserted.length} sales records.`);
}

async function diversifyCustomerDates() {
  const customers = await Customer.find({}, { _id: 1 });
  let updated = 0;
  for (const customer of customers) {
    const paymentDate = randomDateWithin(365);
    const expirationDate = new Date(paymentDate);
    expirationDate.setMonth(expirationDate.getMonth() + 1);

    await Customer.updateOne(
      { _id: customer._id },
      {
        $set: {
          payment_Date: paymentDate,
          expiration_Date: expirationDate,
          createdAt: paymentDate,
          updatedAt: paymentDate > new Date() ? paymentDate : new Date(),
        },
      },
      { runValidators: false }
    );
    updated++;
  }
  console.log(`Diversified dates for ${updated} customer records.`);
}

async function main() {
  await mongoose.connect(databaseConnectionString);
  console.log("Connected to database");

  const inventoryItems = await seedInventory(30);
  await seedSales(1000, inventoryItems);
  await diversifyCustomerDates();

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

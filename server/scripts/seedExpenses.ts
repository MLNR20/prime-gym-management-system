import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import databaseConnectionString from "../config/config";
import Expenses from "../models/expense";

const CATEGORIES = ["Rent", "Utilities", "Wages", "Equipment", "Maintenance", "Supplies", "Miscellaneous"];

const TITLES: Record<string, string[]> = {
  Rent: ["Monthly Gym Rent", "Storage Unit Rent"],
  Utilities: ["Electricity Bill", "Water Bill", "Internet Bill", "Gas Bill"],
  Wages: ["Trainer Wages", "Front Desk Wages", "Cleaning Staff Wages"],
  Equipment: ["Treadmill Repair Parts", "New Dumbbell Set", "Cable Machine Cables", "Spin Bike Purchase"],
  Maintenance: ["HVAC Servicing", "Plumbing Repair", "Equipment Maintenance", "Floor Resurfacing"],
  Supplies: ["Cleaning Supplies Restock", "Office Supplies", "Towel Restock", "Sanitizer Restock"],
  Miscellaneous: ["Marketing Flyers", "Software Subscription", "Insurance Premium", "Licensing Fee"],
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

function randomDueDate(): Date {
  const now = Date.now();
  const offset = randomInt(-30, 30) * 24 * 60 * 60 * 1000;
  return new Date(now + offset);
}

async function seedExpenses(count: number) {
  const docs = [];
  for (let i = 0; i < count; i++) {
    const category = randomFrom(CATEGORIES);
    const title = randomFrom(TITLES[category] as string[]);
    const createdAt = randomDateWithin(180);
    docs.push({
      expense_title: title,
      unit_price: randomInt(50, 5000),
      quantity: randomInt(1, 10),
      categories: category,
      due_date: randomDueDate(),
      createdAt,
      updatedAt: createdAt,
    });
  }
  const inserted = await Expenses.insertMany(docs);
  console.log(`Inserted ${inserted.length} expense records.`);
}

async function main() {
  await mongoose.connect(databaseConnectionString);
  console.log("Connected to database");

  await seedExpenses(40);

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

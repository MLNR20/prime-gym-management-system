import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import databaseConnectionString from "../config/config";
import Sales from "../models/sales";
import Customer from "../models/customer";

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function backfillSalesCustomers() {
  const customers = await Customer.find({}, { _id: 1 });
  if (customers.length === 0) {
    console.log("No customers found — cannot backfill sales.");
    return;
  }

  const salesMissingCustomer = await Sales.find({
    $or: [{ customer_id: { $exists: false } }, { customer_id: null }, { customer_id: "" }],
  });

  console.log(`Found ${salesMissingCustomer.length} sale(s) missing a customer_id.`);

  for (const sale of salesMissingCustomer) {
    const randomCustomer = customers[randomInt(0, customers.length - 1)];
    sale.customer_id = String(randomCustomer!._id);
    await sale.save();
  }

  console.log(`Backfilled ${salesMissingCustomer.length} sale record(s).`);
}

async function main() {
  await mongoose.connect(databaseConnectionString);
  console.log("Connected to database");

  await backfillSalesCustomers();

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

import mongoose from "mongoose";
import databaseConnectionString from "../config/config";
import Customer from "../models/customer";

async function run() {
  await mongoose.connect(databaseConnectionString);

  const customers = await Customer.find({
    $or: [{ email: { $exists: false } }, { email: null }, { email: "" }],
  });

  const seen = new Set<string>();

  for (const customer of customers) {
    const base = `${customer.first_name}.${customer.last_name}`
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, "");

    let candidate = `${base}@example.com`;
    let counter = 1;
    while (seen.has(candidate)) {
      candidate = `${base}${counter}@example.com`;
      counter++;
    }
    seen.add(candidate);

    await Customer.updateOne(
      { _id: customer._id },
      { $set: { email: candidate, updatedAt: new Date() } },
      { runValidators: false },
    );

    console.log(`Set ${customer.first_name} ${customer.last_name} -> ${candidate}`);
  }

  console.log(`Done. Updated ${customers.length} customer(s).`);
  await mongoose.disconnect();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

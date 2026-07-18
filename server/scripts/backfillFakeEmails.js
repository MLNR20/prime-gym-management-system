// Run with: mongosh "<your-connection-string>" server/scripts/backfillFakeEmails.js
// Backfills a fake @example.com email for any Customer document missing one.

const db = db.getSiblingDB("prime-gym");
const seen = new Set();

db.Customer.find({ $or: [{ email: { $exists: false } }, { email: null }, { email: "" }] }).forEach((customer) => {
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

  db.Customer.updateOne({ _id: customer._id }, { $set: { email: candidate, updatedAt: new Date() } });
  print(`Set ${customer.first_name} ${customer.last_name} -> ${candidate}`);
});

print("Done.");

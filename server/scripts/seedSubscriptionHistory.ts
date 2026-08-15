import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import databaseConnectionString from "../config/config";
import Customer from "../models/customer";
import SubscriptionHistory from "../models/subscription_history";
import Session from "../models/session";

const COACHING_TYPES = ["Coaching Subscription", "Monthly with Coaching"];

const FIRST_NAMES = [
  "Miguel", "Andrea", "Carlos", "Bianca", "Rafael", "Camille", "Diego", "Isabel",
  "Gabriel", "Patricia", "Antonio", "Kristine", "Marco", "Angelica", "Paolo",
  "Michelle", "Vince", "Danica", "Julian", "Trisha",
];

const LAST_NAMES = [
  "Santos", "Reyes", "Cruz", "Bautista", "Garcia", "Torres", "Ramos", "Mendoza",
  "Flores", "Rivera", "Castillo", "Gonzales", "Aquino", "Villanueva", "Domingo",
];

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

function amountForType(type: string) {
  return type === "Monthly with Coaching" ? randomInt(2000, 4000) : randomInt(1500, 3000);
}

async function uniqueContactNumbers(count: number): Promise<string[]> {
  const existing = new Set(
    (await Customer.find({}, { contact_no: 1 })).map((c: any) => c.contact_no)
  );
  const numbers: string[] = [];
  while (numbers.length < count) {
    const candidate = `09${randomInt(100000000, 999999999)}`;
    if (!existing.has(candidate)) {
      existing.add(candidate);
      numbers.push(candidate);
    }
  }
  return numbers;
}

async function seedCoachingCustomers(count: number) {
  const contactNumbers = await uniqueContactNumbers(count);

  const docs = contactNumbers.map((contact_no) => {
    const subscription_type = randomFrom(COACHING_TYPES);
    const payment_Date = randomDateWithin(150);
    const expiration_Date = new Date(payment_Date);
    expiration_Date.setMonth(expiration_Date.getMonth() + 1);

    return {
      first_name: randomFrom(FIRST_NAMES),
      last_name: randomFrom(LAST_NAMES),
      amount_paid: amountForType(subscription_type),
      contact_no,
      status: expiration_Date < new Date() ? "Expired" : "Paid",
      payment_option: randomFrom(["GCash", "Cash"]),
      subscription_type,
      payment_Date,
      expiration_Date,
      createdAt: payment_Date,
      updatedAt: payment_Date,
      isDeleted: false,
    };
  });

  const inserted = await Customer.insertMany(docs);
  console.log(`Inserted ${inserted.length} coaching customers.`);
  return inserted;
}

async function seedSubscriptionHistoryFor(customers: any[]) {
  const historyDocs: any[] = [];
  const sessionDocs: any[] = [];

  for (const customer of customers) {
    const renewals = randomInt(1, 3);
    for (let i = 0; i < renewals; i++) {
      const dateRenewed = randomDateWithin(150);
      historyDocs.push({
        customer_id: customer._id.toString(),
        amount: amountForType(customer.subscription_type),
        subscription_type: customer.subscription_type,
        dateRenewed,
        createdAt: dateRenewed,
        updatedAt: dateRenewed,
      });
    }

    sessionDocs.push({
      customer_id: customer._id.toString(),
      created_at: customer.createdAt,
      session_balance: randomInt(0, 10),
    });
  }

  const insertedHistory = await SubscriptionHistory.insertMany(historyDocs);
  console.log(`Inserted ${insertedHistory.length} subscription history records.`);

  const insertedSessions = await Session.insertMany(sessionDocs);
  console.log(`Inserted ${insertedSessions.length} session balance records.`);
}

async function main() {
  await mongoose.connect(databaseConnectionString);
  console.log("Connected to database");

  const customers = await seedCoachingCustomers(15);
  await seedSubscriptionHistoryFor(customers);

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

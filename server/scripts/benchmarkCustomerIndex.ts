import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import databaseConnectionString from "../config/config";
import Sales from "../models/sales";

const ITERATIONS = 30;

async function timeQuery(customerId: string) {
  const durations: number[] = [];
  for (let i = 0; i < ITERATIONS; i++) {
    const start = performance.now();
    await Sales.find({ customer_id: customerId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    durations.push(performance.now() - start);
  }
  const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
  return { avg, min: Math.min(...durations), max: Math.max(...durations) };
}

async function main() {
  await mongoose.connect(databaseConnectionString);
  console.log("Connected to database\n");

  const totalDocs = await Sales.countDocuments({});
  const sample = await Sales.findOne({});
  const customerId = sample!.customer_id;
  console.log(`Sales collection size: ${totalDocs} documents`);
  console.log(`Benchmarking query: Sales.find({ customer_id }).sort({ createdAt: -1 }).limit(10)\n`);

  // ── WITHOUT INDEX ──────────────────────────────────────────────
  try {
    await Sales.collection.dropIndex("customer_id_1_createdAt_-1");
  } catch (err) {
    // index may not exist yet, that's fine
  }

  const explainNoIndex = await Sales.find({ customer_id: customerId })
    .sort({ createdAt: -1 })
    .limit(10)
    .explain("executionStats");
  const statsNoIndex = (explainNoIndex as any).executionStats;

  const resultsNoIndex = await timeQuery(customerId);

  console.log("── WITHOUT INDEX (collection scan) ──");
  console.log(`  Winning plan stage: ${(explainNoIndex as any).queryPlanner.winningPlan.inputStage?.stage ?? (explainNoIndex as any).queryPlanner.winningPlan.stage}`);
  console.log(`  Documents examined: ${statsNoIndex.totalDocsExamined}`);
  console.log(`  Documents returned: ${statsNoIndex.nReturned}`);
  console.log(`  Server execution time (ms): ${statsNoIndex.executionTimeMillis}`);
  console.log(`  Client round-trip avg over ${ITERATIONS} runs (ms): ${resultsNoIndex.avg.toFixed(2)} (min ${resultsNoIndex.min.toFixed(2)}, max ${resultsNoIndex.max.toFixed(2)})\n`);

  // ── WITH INDEX ─────────────────────────────────────────────────
  await Sales.collection.createIndex({ customer_id: 1, createdAt: -1 });

  const explainWithIndex = await Sales.find({ customer_id: customerId })
    .sort({ createdAt: -1 })
    .limit(10)
    .explain("executionStats");
  const statsWithIndex = (explainWithIndex as any).executionStats;

  const resultsWithIndex = await timeQuery(customerId);

  console.log("── WITH INDEX ──");
  console.log(`  Winning plan stage: ${(explainWithIndex as any).queryPlanner.winningPlan.inputStage?.stage ?? (explainWithIndex as any).queryPlanner.winningPlan.stage}`);
  console.log(`  Documents examined: ${statsWithIndex.totalDocsExamined}`);
  console.log(`  Documents returned: ${statsWithIndex.nReturned}`);
  console.log(`  Server execution time (ms): ${statsWithIndex.executionTimeMillis}`);
  console.log(`  Client round-trip avg over ${ITERATIONS} runs (ms): ${resultsWithIndex.avg.toFixed(2)} (min ${resultsWithIndex.min.toFixed(2)}, max ${resultsWithIndex.max.toFixed(2)})\n`);

  console.log("── SUMMARY ──");
  console.log(`  Docs examined:  ${statsNoIndex.totalDocsExamined} → ${statsWithIndex.totalDocsExamined}`);
  console.log(`  Avg round trip: ${resultsNoIndex.avg.toFixed(2)}ms → ${resultsWithIndex.avg.toFixed(2)}ms`);

  await mongoose.disconnect();
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

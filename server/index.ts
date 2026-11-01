// src/index.ts
import dotenv from "dotenv";
dotenv.config();

import "./config/env";

import express, { Request, Response, Application } from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { csrfGuard } from "./middleware/csrfGuard";
import databaseConnectionString from "./config/config";

import customerRouter from "./router/customer"
import authRouter from "./router/auth"
import contactRouter from "./router/contacts";
import exerciseRouter from "./router/exercise";
import lockerRouter from "./router/locker";
import equipmentRouter from "./router/equipment";
import logsRouter from "./router/logs";
import programRouter from "./router/program";
import { subscriptionCron } from "./crons/subscriptionCron";
import SubscriptionHistoryRepositoryRouter from "./router/subscriptionhistory";
import adminRouter from "./router/admin";
import attendanceRouter from "./router/attendance";
import inventoryRouter from "./router/inventory";
import salesRouter from "./router/sales";
import expenseRouter from "./router/expense";
import sessionRouter from "./router/session";
import sessionAssignmentRouter from "./router/sessionAssignment";

const app: Application = express();
const PORT = process.env.PORT ?? 3002;
const CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:5180";
const isProduction = process.env.NODE_ENV === "production";
const localOriginPattern = /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/;

const isAllowedOrigin = (origin: string) =>
  origin === CLIENT_URL || (!isProduction && localOriginPattern.test(origin));

app.use(
  cors({
    // Auth lives in httpOnly cookies, so the browser must be allowed to send them.
    credentials: true,
    origin: (origin, callback) => {
      if (!origin || isAllowedOrigin(origin)) {
        return callback(null, true);
      }
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
  })
);
app.use(cookieParser());
app.use(csrfGuard(isAllowedOrigin));
app.use(express.json());
app.use("/customers",customerRouter);
app.use("/auth", authRouter)
app.use("/exercises", exerciseRouter);
app.use("/contacts", contactRouter);
app.use("/lockers", lockerRouter);
app.use("/equipment", equipmentRouter);
app.use("/logs", logsRouter);
app.use("/programs", programRouter);
app.use("/subscription", SubscriptionHistoryRepositoryRouter)
app.use("/admin", adminRouter);
app.use("/attendance", attendanceRouter);
app.use("/inventory", inventoryRouter);
app.use("/sales", salesRouter);
app.use("/expenses", expenseRouter);
app.use("/sessions", sessionRouter);
app.use("/session-assignments", sessionAssignmentRouter);


mongoose.connect(databaseConnectionString).then(()=>{
    console.log('App connected to database');
}).catch((error) =>{
    console.log(error);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// src/index.ts
import express, { Request, Response, Application } from "express";
import mongoose from "mongoose";
import cors from "cors";
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

const app: Application = express();
const PORT = process.env.PORT ?? 3002;


app.use(cors());
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


mongoose.connect(databaseConnectionString).then(()=>{
    console.log('App connected to database');
}).catch((error) =>{
    console.log(error);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

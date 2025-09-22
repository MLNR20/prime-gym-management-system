// src/index.ts
import express, { Request, Response, Application } from "express";
import mongoose from "mongoose";
import cors from "cors";
import databaseConnectionString from "./config/config";
import customerRouter from "./router/customer"

const app: Application = express();
const PORT = process.env.PORT ?? 3002;

app.use(cors());
app.use(express.json());
app.use("/customers",customerRouter);

mongoose.connect(databaseConnectionString).then(()=>{
    console.log('App connected to database');
}).catch((error) =>{
    console.log(error);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

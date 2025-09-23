import { Schema, model, Document } from "mongoose";

export interface ILogs {
  admin_id: string;
  logs: string;
  createdAt: Date;
}

export interface ILogsDocument extends ILogs, Document {}

const logsSchema = new Schema<ILogsDocument>(
  {
    admin_id: { type: String, trim: true },
    logs: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "Logs" }
);

const Logs = model<ILogsDocument>("Logs", logsSchema);

export default Logs;

import { Schema, model, Document } from "mongoose";

export interface ILogs {
   logs:string,
   admin_id: string;
   createdAt: Date,
}

export interface ILogsDocument extends ILogs, Document {}


const logsSchema = new Schema<ILogsDocument>(
  {
    logs: { type: String, required: true, trim: true },
    admin_id:{type:String, required:true, trim:true},
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "Logs" }
);

const Logs = model<ILogsDocument>("Logs", logsSchema);

export default Logs;

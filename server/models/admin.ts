import { Schema, model, Document } from "mongoose";

export interface IAdmin extends Document {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  createdAt: Date;
}

const adminSchema = new Schema<IAdmin>(
  {
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "Admin" }
);

const Admin = model<IAdmin>("Admin", adminSchema);
export default Admin;

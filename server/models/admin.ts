import { Schema, model, Document } from "mongoose";

export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface IAdmin extends Document {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  email: string;
  createdAt: Date;
  isDeleted: Boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  isOtpVerified: boolean;
  approvalStatus: ApprovalStatus;
  otpHash?: string;
  otpExpires?: Date;
}

const adminSchema = new Schema<IAdmin>(
  {
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email:{ type:String, required:true},
    createdAt: { type: Date, default: Date.now },
    isDeleted: {type:Boolean, default: false},
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    // Default to true/"approved" so existing/seeded accounts aren't locked
    // out; the self-service register() flow explicitly sets both otherwise
    // for new signups.
    isOtpVerified: { type: Boolean, default: true },
    approvalStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "approved" },
    otpHash: { type: String },
    otpExpires: { type: Date },
  },
  { collection: "Admin" }
);

const Admin = model<IAdmin>("Admin", adminSchema);
export default Admin;

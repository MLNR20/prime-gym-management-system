import { Request } from "express";
import { Types } from "mongoose";

export interface RequestWithUser extends Request {
  admin?: {
    _id: Types.ObjectId;  // admin id
    email: string;
    role: string;
  };
}

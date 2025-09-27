import { Request } from "express";
import { Types } from "mongoose";

export interface RequestWithUser extends Request {
  admin?: {
    _id: string;  
    first_name: string;
    last_name: string;
  };
}

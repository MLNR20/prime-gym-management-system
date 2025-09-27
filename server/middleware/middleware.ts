// middleware/authMiddleware.ts
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import admin from "../models/admin"; // your admin/user model
import { RequestWithUser } from "./types/express";
import { AuthRepository } from "../repository/authRepository";


const authRepository = new AuthRepository();

export async function authMiddleware(req: RequestWithUser, res: Response, next: NextFunction) 
{
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.replace("Bearer ", "");
    const payload = jwt.verify(token, process.env.JWT_SECRET || "secret") as { id: string };

    const admin = await authRepository.findById(payload.id);
    if (!admin) return res.status(401).json({ message: "Invalid token" });

    // Attach admin info to req
    req.admin = { _id: admin._id!.toString(), first_name: admin.first_name, last_name: admin.last_name };
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

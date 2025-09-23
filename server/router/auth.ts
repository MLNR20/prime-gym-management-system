// src/router/authRouter.ts
import express, { Request, Response } from "express";
import { AuthService } from "../repository/services/authService";
import { AuthRepository } from "../repository/authRepository";

const authRouter = express.Router();
const authService = new AuthService(new AuthRepository());

// Register
authRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const { first_name,last_name, password, username } = req.body;
    const user = await authService.register(first_name, last_name, password, username);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: "Registration failed" });
  }
});

// Login
authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const token = await authService.login(username, password);

    if (!token) return res.status(401).json({ error: "Invalid credentials" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});


export default authRouter;
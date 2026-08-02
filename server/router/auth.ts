// src/router/authRouter.ts
import express, { Request, Response } from "express";
import { AuthService } from "../repository/services/authService";
import { AuthRepository } from "../repository/authRepository";

const authRouter = express.Router();
const authService = new AuthService(new AuthRepository());

// Register
authRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const { first_name,last_name, password, username, email } = req.body;
    const user = await authService.register(first_name, last_name, password, username, email);
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

    if (!token)
    { 
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Forgot password
authRouter.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    await authService.forgotPassword(email);
    res.status(200).json({ message: "If that email is registered, a reset link has been sent." });
  } catch (err) {
    res.status(500).json({ error: "Failed to process request" });
  }
});

// Reset password
authRouter.post("/reset-password/:token", async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ error: "Token and password are required" });
    }
    const success = await authService.resetPassword(token, password);
    if (!success) {
      return res.status(400).json({ error: "Invalid or expired reset link" });
    }
    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to reset password" });
  }
});

export default authRouter;
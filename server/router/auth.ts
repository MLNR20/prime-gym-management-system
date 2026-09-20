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
    const result = await authService.login(username, password);

    switch (result.status) {
      case "success":
        return res.status(200).json({ token: result.token });
      case "otp_pending":
        return res.status(403).json({
          error: "Please verify your email using the code we sent you before logging in.",
          reason: "otp_pending",
        });
      case "approval_pending":
        return res.status(403).json({
          error: "Your account is awaiting admin approval.",
          reason: "approval_pending",
        });
      case "approval_rejected":
        return res.status(403).json({
          error: "Your account request was rejected. Please contact an administrator.",
          reason: "approval_rejected",
        });
      default:
        return res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Verify OTP
authRouter.post("/verify-otp", async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: "Email and code are required" });
    }
    const verified = await authService.verifyOtp(email, otp);
    if (!verified) {
      return res.status(400).json({ error: "That code is invalid or has expired" });
    }
    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to verify code" });
  }
});

// Resend OTP
authRouter.post("/resend-otp", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    await authService.resendOtp(email);
    res.status(200).json({ message: "If that email needs verification, a new code has been sent." });
  } catch (err) {
    res.status(500).json({ error: "Failed to resend code" });
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
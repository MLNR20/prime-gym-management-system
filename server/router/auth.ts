// src/router/authRouter.ts
import express, { Request, Response } from "express";
import { AuthService } from "../repository/services/authService";
import { AuthRepository } from "../repository/authRepository";
import {
  validate,
  registerValidation,
  loginValidation,
  verifyOtpValidation,
  emailOnlyValidation,
  resetPasswordValidation,
} from "../utils/validation";
import { LoginRequestDto, toLoginResponseDto } from "../dto/auth.dto";
import { RefreshTokenRepository } from "../repository/refreshTokenRepository";
import { authMiddleware } from "../middleware/middleware";
import { RequestWithUser } from "../middleware/types/express";
import { REFRESH_COOKIE, setAuthCookies, clearAuthCookies } from "../utils/authCookies";

const authRouter = express.Router();
const authService = new AuthService(new AuthRepository(), new RefreshTokenRepository());

// Register
authRouter.post("/register", registerValidation, validate, async (req: Request, res: Response) => {
  try {
    const { first_name,last_name, password, username, email } = req.body;
    const user = await authService.register(first_name, last_name, password, username, email);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: "Registration failed" });
  }
});

// Login
authRouter.post("/login", loginValidation, validate, async (req: Request<{}, {}, LoginRequestDto>, res: Response) => {
  try {
    const { username, password } = req.body;
    const result = await authService.login(username, password);
    if (result.status === "success") {
      setAuthCookies(res, result.accessToken, result.refreshToken);
    }
    const { statusCode, body } = toLoginResponseDto(result);
    return res.status(statusCode).json(body);
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Rotate the refresh token and issue a fresh access token
authRouter.post("/refresh", async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.[REFRESH_COOKIE];
    const session = refreshToken ? await authService.refresh(refreshToken) : null;
    if (!session) {
      clearAuthCookies(res);
      return res.status(401).json({ error: "Session expired" });
    }
    setAuthCookies(res, session.accessToken, session.refreshToken);
    res.status(200).json(session.admin);
  } catch (err) {
    res.status(500).json({ error: "Failed to refresh session" });
  }
});

// Logout: revoke the refresh token and clear both cookies
authRouter.post("/logout", async (req: Request, res: Response) => {
  try {
    await authService.logout(req.cookies?.[REFRESH_COOKIE]);
  } catch (err) {
    console.error(err);
  }
  clearAuthCookies(res);
  res.status(204).end();
});

// Who is logged in? Lets the client restore its session from the cookie
authRouter.get("/me", authMiddleware, (req: RequestWithUser, res: Response) => {
  const { first_name, last_name } = req.admin!;
  res.status(200).json({ first_name, last_name });
});

// Verify OTP
authRouter.post("/verify-otp", verifyOtpValidation, validate, async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
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
authRouter.post("/resend-otp", emailOnlyValidation, validate, async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await authService.resendOtp(email);
    res.status(200).json({ message: "If that email needs verification, a new code has been sent." });
  } catch (err) {
    res.status(500).json({ error: "Failed to resend code" });
  }
});

// Forgot password
authRouter.post("/forgot-password", emailOnlyValidation, validate, async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email);
    res.status(200).json({ message: "If that email is registered, a reset link has been sent." });
  } catch (err) {
    res.status(500).json({ error: "Failed to process request" });
  }
});

// Reset password
authRouter.post("/reset-password/:token", resetPasswordValidation, validate, async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    if (!token) {
      return res.status(400).json({ error: "Token is required" });
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
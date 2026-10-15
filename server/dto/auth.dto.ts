// src/dto/auth.dto.ts
import { LoginResult } from "../repository/services/authService";

export interface LoginRequestDto {
  username: string;
  password: string;
}

export interface LoginSuccessResponseDto {
  token: string;
}

export interface LoginErrorResponseDto {
  error: string;
  reason?: "otp_pending" | "approval_pending" | "approval_rejected";
}

export type LoginResponseDto = LoginSuccessResponseDto | LoginErrorResponseDto;

export function toLoginResponseDto(result: LoginResult): { statusCode: number; body: LoginResponseDto } {
  switch (result.status) {
    case "success":
      return { statusCode: 200, body: { token: result.token } };
    case "otp_pending":
      return {
        statusCode: 403,
        body: {
          error: "Please verify your email using the code we sent you before logging in.",
          reason: "otp_pending",
        },
      };
    case "approval_pending":
      return {
        statusCode: 403,
        body: { error: "Your account is awaiting admin approval.", reason: "approval_pending" },
      };
    case "approval_rejected":
      return {
        statusCode: 403,
        body: {
          error: "Your account request was rejected. Please contact an administrator.",
          reason: "approval_rejected",
        },
      };
    default:
      return { statusCode: 401, body: { error: "Invalid credentials" } };
  }
}

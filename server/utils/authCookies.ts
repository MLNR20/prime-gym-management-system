import { CookieOptions, Response } from "express";

export const ACCESS_COOKIE = "access_token";
export const REFRESH_COOKIE = "refresh_token";

export const ACCESS_TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes
export const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const isProduction = process.env.NODE_ENV === "production";

// In production the client and API are normally on different sites (e.g. a
// static host + Render), and browsers drop SameSite=Lax cookies set by a
// cross-site response, so production defaults to "none" (HTTPS only, which
// `secure` below guarantees). Set COOKIE_SAMESITE=lax|strict to override
// when both are served from one site.
const requestedSameSite = process.env.COOKIE_SAMESITE;
const sameSite: CookieOptions["sameSite"] =
  requestedSameSite === "none" || requestedSameSite === "strict" || requestedSameSite === "lax"
    ? requestedSameSite
    : isProduction
      ? "none"
      : "lax";
const secure = isProduction || sameSite === "none";

function baseOptions(maxAge: number, path: string): CookieOptions {
  return { httpOnly: true, secure, sameSite, maxAge, path };
}

export function setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
  res.cookie(ACCESS_COOKIE, accessToken, baseOptions(ACCESS_TOKEN_TTL_MS, "/"));
  // Only sent to /auth/*, so it isn't attached to every API request.
  res.cookie(REFRESH_COOKIE, refreshToken, baseOptions(REFRESH_TOKEN_TTL_MS, "/auth"));
}

export function clearAuthCookies(res: Response): void {
  res.clearCookie(ACCESS_COOKIE, baseOptions(0, "/"));
  res.clearCookie(REFRESH_COOKIE, baseOptions(0, "/auth"));
}

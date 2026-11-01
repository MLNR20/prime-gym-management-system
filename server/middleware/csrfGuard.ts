import { Request, Response, NextFunction } from "express";

// Cookies ride along on cross-site requests, so state-changing requests must
// come from an allowed origin. Browsers always send Origin on cross-origin
// POST/PUT/PATCH/DELETE; requests without one (curl, server-to-server) carry
// no ambient cookie credentials and are let through.
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export function csrfGuard(isAllowedOrigin: (origin: string) => boolean) {
  return (req: Request, res: Response, next: NextFunction) => {
    const origin = req.header("Origin");
    if (SAFE_METHODS.has(req.method) || !origin || isAllowedOrigin(origin)) {
      return next();
    }
    return res.status(403).json({ message: "Origin not allowed" });
  };
}

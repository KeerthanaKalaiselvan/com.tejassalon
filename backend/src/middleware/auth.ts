import { NextFunction, Request, Response } from "express";
import { AUTH_COOKIE_NAME, verifyAuthToken } from "../lib/auth";

declare global {
  namespace Express {
    interface Request {
      auth?: { userId: string; isAdmin: boolean };
    }
  }
}

function extractToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) return header.slice(7);
  const cookieToken = req.cookies?.[AUTH_COOKIE_NAME];
  return cookieToken || null;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = extractToken(req);
  const payload = token ? verifyAuthToken(token) : null;
  if (!payload) return res.status(401).json({ error: "Not authenticated" });
  req.auth = payload;
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = extractToken(req);
  const payload = token ? verifyAuthToken(token) : null;
  if (!payload || !payload.isAdmin) {
    return res.status(403).json({ error: "Admin access required" });
  }
  req.auth = payload;
  next();
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const token = extractToken(req);
  const payload = token ? verifyAuthToken(token) : null;
  if (payload) req.auth = payload;
  next();
}

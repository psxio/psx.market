import type { Request, Response, NextFunction } from "express";

declare module "express-session" {
  interface SessionData {
    adminId: string;
    clientId: string;
  }
}

export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.adminId) {
    return res.status(401).json({ error: "Unauthorized - Admin authentication required" });
  }
  
  const origin = req.get("origin");
  const referer = req.get("referer");
  const host = req.get("host");
  
  if (req.method !== "GET" && req.method !== "HEAD") {
    const isValidOrigin = origin && new URL(origin).host === host;
    const isValidReferer = referer && new URL(referer).host === host;
    
    if (!isValidOrigin && !isValidReferer) {
      return res.status(403).json({ error: "CSRF validation failed" });
    }
  }
  
  next();
}

export function requireClientAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.clientId) {
    return res.status(401).json({ error: "Unauthorized - Client authentication required" });
  }
  
  const origin = req.get("origin");
  const referer = req.get("referer");
  const host = req.get("host");
  
  if (req.method !== "GET" && req.method !== "HEAD") {
    const isValidOrigin = origin && new URL(origin).host === host;
    const isValidReferer = referer && new URL(referer).host === host;
    
    if (!isValidOrigin && !isValidReferer) {
      return res.status(403).json({ error: "CSRF validation failed" });
    }
  }
  
  next();
}

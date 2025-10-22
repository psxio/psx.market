import type { Request, Response, NextFunction } from "express";

declare module "express-session" {
  interface SessionData {
    adminId: string;
    clientId: string;
    clientAddress: string;
    builderId: string;
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
    try {
      const isValidOrigin = origin && new URL(origin).host === host;
      const isValidReferer = referer && new URL(referer).host === host;
      
      if (!isValidOrigin && !isValidReferer) {
        console.error("CSRF validation failed:", {
          origin,
          referer,
          host,
          isValidOrigin,
          isValidReferer,
          method: req.method,
          path: req.path
        });
        return res.status(403).json({ error: "CSRF validation failed" });
      }
    } catch (error) {
      console.error("Error in CSRF validation:", error, {
        origin,
        referer,
        host,
        method: req.method,
        path: req.path
      });
      return res.status(403).json({ error: "CSRF validation error" });
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

export function requireBuilderAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.builderId) {
    return res.status(401).json({ error: "Unauthorized - Builder authentication required" });
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

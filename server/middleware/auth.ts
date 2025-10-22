import type { Request, Response, NextFunction } from "express";
import { randomBytes } from "crypto";

declare module "express-session" {
  interface SessionData {
    adminId: string;
    clientId: string;
    clientAddress: string;
    builderId: string;
  }
}

// In-memory token store (use Redis in production)
const adminTokens = new Map<string, string>(); // token -> adminId

export function generateAdminToken(adminId: string): string {
  const token = randomBytes(32).toString("hex");
  adminTokens.set(token, adminId);
  return token;
}

export function verifyAdminToken(token: string): string | null {
  return adminTokens.get(token) || null;
}

export function revokeAdminToken(token: string): void {
  adminTokens.delete(token);
}

export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  // Check for Bearer token first (for iframe/cookie-blocked scenarios)
  const authHeader = req.get("Authorization");
  
  console.log("[requireAdminAuth] Headers check:", {
    hasAuthHeader: !!authHeader,
    authHeader: authHeader ? authHeader.substring(0, 20) + "..." : "none",
    allHeaders: Object.keys(req.headers),
    method: req.method,
    path: req.path,
  });
  
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const adminId = verifyAdminToken(token);
    
    if (adminId) {
      // Create a temporary session object for token-based auth
      req.session.adminId = adminId;
      console.log("[requireAdminAuth] Token auth successful:", { adminId, method: req.method, path: req.path });
      return next();
    }
  }

  // Fallback to session-based auth
  console.log("[requireAdminAuth] Session check:", {
    hasSession: !!req.session,
    adminId: req.session?.adminId,
    sessionID: req.sessionID,
    method: req.method,
    path: req.path,
  });

  if (!req.session.adminId) {
    console.log("[requireAdminAuth] UNAUTHORIZED - No admin session found");
    return res.status(401).json({ error: "Unauthorized - Admin authentication required" });
  }
  
  // CSRF validation for non-GET requests
  if (req.method !== "GET" && req.method !== "HEAD") {
    const origin = req.get("origin");
    const referer = req.get("referer");
    const host = req.get("host");
    
    // In development, skip CSRF if both origin and referer are missing
    // (This happens in Replit's iframe environment)
    if (process.env.NODE_ENV !== "production" && !origin && !referer) {
      console.log("[CSRF] Skipping validation in development (no origin/referer)");
    } else {
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

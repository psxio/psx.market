import { Request, Response, NextFunction } from 'express';
import { users } from '../../shared/schema.js';
import { db } from '../db.js';
import { eq } from 'drizzle-orm';

export interface PrivyAuthRequest extends Request {
  user?: {
    id: string;
    privyId: string;
    walletAddress?: string;
    email?: string;
    name?: string;
    authProvider: string;
    builderId?: string;
    clientId?: string;
  };
}

export async function privyAuthMiddleware(
  req: PrivyAuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);
    
    const privyUserId = req.headers['x-privy-user-id'] as string;
    
    if (!privyUserId) {
      return next();
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.privyId, privyUserId)
    });

    if (existingUser) {
      req.user = {
        id: existingUser.id,
        privyId: existingUser.privyId!,
        walletAddress: existingUser.walletAddress || undefined,
        email: existingUser.email || undefined,
        name: existingUser.name || undefined,
        authProvider: existingUser.authProvider,
        builderId: existingUser.builderId || undefined,
        clientId: existingUser.clientId || undefined,
      };
    }

    next();
  } catch (error) {
    console.error('Privy auth middleware error:', error);
    next();
  }
}

export function requireAuth(
  req: PrivyAuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

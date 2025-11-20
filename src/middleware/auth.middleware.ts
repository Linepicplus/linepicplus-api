/**
 * Authentication Middleware
 * Check if user is authenticated admin
 */

import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service';

// Extend Express Request to include admin session
declare global {
  namespace Express {
    interface Request {
      admin?: {
        id: string;
        email: string;
        name: string;
        role: string;
      };
    }
  }
}

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check for session cookie or Authorization header
    const sessionId = req.cookies?.admin_session || req.headers['x-admin-session'];
    
    if (!sessionId) {
      return res.status(401).json({ error: 'Unauthorized - No session' });
    }

    // Verify session (simple check - in production use JWT or proper session store)
    const admin = await AdminService.getAdminById(sessionId);
    
    if (!admin) {
      return res.status(401).json({ error: 'Unauthorized - Invalid session' });
    }

    // Attach admin to request
    req.admin = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    };

    next();
  } catch (error) {
    console.error('[Auth Middleware] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const optionalAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = req.cookies?.admin_session || req.headers['x-admin-session'];
    
    if (sessionId) {
      const admin = await AdminService.getAdminById(sessionId);
      if (admin) {
        req.admin = {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        };
      }
    }

    next();
  } catch (error) {
    console.error('[Optional Auth Middleware] Error:', error);
    next();
  }
};


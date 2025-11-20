/**
 * Admin Authentication Routes
 */

import { Router, Request, Response } from 'express';
import { AdminService } from '../services/admin.service';
import { AdminLoginDTO } from '../models/admin.model';

const router = Router();

/**
 * POST /admin/login
 * Admin login
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const data: AdminLoginDTO = req.body;

    if (!data.email || !data.password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const session = await AdminService.login(data);

    if (!session) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Set session cookie
    res.cookie('admin_session', session.id, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax',
    });

    console.log('[Admin Login] Session:', session);

    res.json({
      success: true,
      admin: {
        id: session.id,
        email: session.email,
        name: session.name,
        role: session.role,
      },
    });
  } catch (error) {
    console.error('[Admin Login] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /admin/logout
 * Admin logout
 */
router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('admin_session');
  res.json({ success: true });
});

/**
 * GET /admin/me
 * Get current admin session
 */
router.get('/me', async (req: Request, res: Response) => {
  try {
    const sessionId = req.cookies?.admin_session;

    if (!sessionId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const admin = await AdminService.getAdminById(sessionId);

    if (!admin) {
      res.clearCookie('admin_session');
      return res.status(401).json({ error: 'Invalid session' });
    }

    res.json({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });
  } catch (error) {
    console.error('[Admin Me] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


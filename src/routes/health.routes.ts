/**
 * Health Check Routes
 * GET /health - Health check endpoint
 */

import { Router, Request, Response } from 'express';
import { DatabaseService } from '../services/database.service';

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Health check
 *     description: Check if the API is running and database is connected
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 database:
 *                   type: string
 *                   example: connected
 *       503:
 *         description: Service unavailable
 */
router.get('/health', (req: Request, res: Response) => {
  try {
    const db = DatabaseService.getInstance();
    const dbStatus = db.isConnected() ? 'connected' : 'disconnected';

    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: dbStatus,
      environment: process.env.NODE_ENV || 'development',
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'error',
      message: 'Database not initialized',
    });
  }
});

export default router;


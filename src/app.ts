/**
 * Express Application
 * Main app configuration
 */

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.config';
import { corsMiddleware } from './middleware/cors.middleware';
import { requestLogger } from './middleware/logger.middleware';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

// Import routes
import healthRoutes from './routes/health.routes';
import productsRoutes from './routes/products.routes';
import ordersRoutes from './routes/orders.routes';
import uploadRoutes from './routes/upload.routes';
import paymentsRoutes from './routes/payments.routes';

export const createApp = (): Application => {
  const app = express();

  // Security middleware
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));

  // CORS middleware
  app.use(cors());
  app.use(corsMiddleware);

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Compression middleware
  app.use(compression());

  // Logger middleware
  app.use(requestLogger);

  // Serve static files (uploads)
  app.use('/uploads', express.static('uploads'));

  // API Documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Linepicplus API Documentation',
  }));

  // Serve swagger spec as JSON
  app.get('/api-docs.json', (_, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Root endpoint
  app.get('/', (_, res) => {
    res.json({
      name: 'Linepicplus API',
      version: '1.0.0',
      description: 'E-commerce REST API for custom photo frames',
      endpoints: {
        health: '/wp-json/linepicplus/v1/health',
        products: '/wp-json/linepicplus/v1/products',
        orders: '/wp-json/linepicplus/v1/orders',
        upload: '/wp-json/linepicplus/v1/upload',
        payments: '/wp-json/linepicplus-payments/v1',
        documentation: '/api-docs',
      },
    });
  });

  // API Routes - Linepicplus v1
  const linepicplusV1Router = express.Router();
  linepicplusV1Router.use(healthRoutes);
  linepicplusV1Router.use(productsRoutes);
  linepicplusV1Router.use(ordersRoutes);
  linepicplusV1Router.use(uploadRoutes);
  app.use('/wp-json/linepicplus/v1', linepicplusV1Router);

  // API Routes - Payments v1
  const paymentsV1Router = express.Router();
  paymentsV1Router.use(paymentsRoutes);
  app.use('/wp-json/linepicplus-payments/v1', paymentsV1Router);

  // 404 handler
  app.use(notFoundHandler);

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
};


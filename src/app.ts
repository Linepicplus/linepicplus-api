/**
 * Express Application
 * Main app configuration
 */

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import path from 'path';
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
import adminAuthRoutes from './routes/admin-auth.routes';
import adminApiRoutes from './routes/admin-api.routes';

export const createApp = (): Application => {
  const app = express();

  // Security middleware
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        scriptSrcAttr: ["'none'"],
        imgSrc: ["'self'", "data:", "https:", "http:"], // Allow external images
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
  }));

  // CORS middleware
  app.use(cors());
  app.use(corsMiddleware);

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Cookie parser middleware
  app.use(cookieParser());

  // Compression middleware
  app.use(compression());

  // Logger middleware
  app.use(requestLogger);

  // Serve static files
  app.use('/uploads', express.static('uploads'));
  app.use('/css', express.static('public/css'));
  app.use('/js', express.static('public/js'));
  app.use('/html', express.static('public/html'));
  app.use('/landing', express.static('public/landing'));

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

  // Root endpoint - Serve landing page
  app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'landing', 'index.html'));
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

  // Admin Routes
  app.use('/admin', adminAuthRoutes);
  app.use('/admin/api', adminApiRoutes);

  // Admin Pages
  app.get('/admin/login', (_, res) => {
    res.sendFile(path.join(__dirname, '../public/html/admin/login.html'));
  });

  app.get('/admin', (_, res) => {
    res.sendFile(path.join(__dirname, '../public/html/admin/index.html'));
  });

  app.get('/admin/orders', (_, res) => {
    res.sendFile(path.join(__dirname, '../public/html/admin/orders.html'));
  });

  app.get('/admin/orders/:id', (_, res) => {
    res.sendFile(path.join(__dirname, '../public/html/admin/order-detail.html'));
  });

  app.get('/admin/products', (_, res) => {
    res.sendFile(path.join(__dirname, '../public/html/admin/products.html'));
  });

  app.get('/admin/products/:id', (_, res) => {
    res.sendFile(path.join(__dirname, '../public/html/admin/product-detail.html'));
  });

  app.get('/admin/coupons', (_, res) => {
    res.sendFile(path.join(__dirname, '../public/html/admin/coupons.html'));
  });

  app.get('/admin/uploads', (_, res) => {
    res.sendFile(path.join(__dirname, '../public/html/admin/uploads.html'));
  });

  // 404 handler
  app.use(notFoundHandler);

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
};


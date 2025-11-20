/**
 * Server Entry Point
 * Initialize database, services, and start the server
 */

import dotenv from 'dotenv';
import { createApp } from './app';
import { DatabaseService } from './services/database.service';
import { PaymentService } from './services/payment.service';
import { UploadService } from './services/upload.service';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3030;
const HOST = process.env.HOST || 'localhost';

async function startServer() {
  try {
    console.log('🚀 Starting Linepicplus API...');

    // Initialize database
    const dbType = (process.env.DB_TYPE || 'filedb') as 'filedb' | 'mongodb';
    const dbPath = process.env.FILE_DB_PATH || './data';
    
    console.log(`📦 Initializing ${dbType} database...`);
    await DatabaseService.initialize(dbType, { path: dbPath });
    console.log('✅ Database connected');

    // Initialize Stripe
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (stripeSecretKey) {
      PaymentService.initialize(stripeSecretKey);
      console.log('💳 Stripe initialized');
    } else {
      console.warn('⚠️  Stripe not configured (STRIPE_SECRET_KEY missing)');
    }

    // Configure upload service
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    UploadService.setUploadPath(uploadPath);
    await UploadService.ensureUploadDirectory();
    console.log(`📁 Upload directory ready: ${uploadPath}`);

    // Create Express app
    const app = createApp();

    // Start server
    app.listen(PORT, () => {
      console.log('');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✨ Linepicplus API is running!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');
      console.log(`🌍 Server:        http://${HOST}:${PORT}`);
      console.log(`📚 API Docs:      http://${HOST}:${PORT}/api-docs`);
      console.log(`🏥 Health Check:  http://${HOST}:${PORT}/wp-json/linepicplus/v1/health`);
      console.log('');
      console.log(`📦 Database:      ${dbType}`);
      console.log(`🌐 Environment:   ${process.env.NODE_ENV || 'development'}`);
      console.log('');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');
      console.log('API Endpoints:');
      console.log(`  GET  /wp-json/linepicplus/v1/products`);
      console.log(`  GET  /wp-json/linepicplus/v1/product`);
      console.log(`  POST /wp-json/linepicplus/v1/orders`);
      console.log(`  POST /wp-json/linepicplus/v1/order-billing-shipping`);
      console.log(`  POST /wp-json/linepicplus/v1/order-coupon`);
      console.log(`  GET  /wp-json/linepicplus/v1/track-orders`);
      console.log(`  POST /wp-json/linepicplus/v1/upload`);
      console.log(`  POST /wp-json/linepicplus-payments/v1/create-intent`);
      console.log(`  POST /wp-json/linepicplus-payments/v1/confirm-intent`);
      console.log('');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('');
      console.log('⚠️  SIGTERM signal received: closing HTTP server');
      await DatabaseService.close();
      console.log('✅ Database closed');
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      console.log('');
      console.log('⚠️  SIGINT signal received: closing HTTP server');
      await DatabaseService.close();
      console.log('✅ Database closed');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();


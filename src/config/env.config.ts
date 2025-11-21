/**
 * Environment Configuration
 * Centralized environment variables
 */

import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config();

export const config = {
  // Server
  port: parseInt(process.env.PORT || '3030', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Domain
  apiUrl: process.env.API_URL || 'http://localhost:3030',
  
  // Stripe
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
  
  // Admin
  adminSessionSecret: process.env.ADMIN_SESSION_SECRET || 'change-this-secret-in-production',
  
  // Database
  mongodbUri: process.env.MONGODB_URI || '',
};

/**
 * Get full URL for a path
 * Automatically prepends the API_URL if the path is relative
 */
export function getFullUrl(path: string): string {
  // If already absolute URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // If relative path, prepend API_URL
  const baseUrl = config.apiUrl.endsWith('/') ? config.apiUrl.slice(0, -1) : config.apiUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${baseUrl}${cleanPath}`;
}


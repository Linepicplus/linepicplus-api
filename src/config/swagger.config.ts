/**
 * Swagger/OpenAPI Configuration
 */

import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Linepicplus API',
      version: '1.0.0',
      description: 'E-commerce REST API for custom photo frames - Compatible with WooCommerce structure',
      contact: {
        name: 'Jeremy Guyet',
        email: 'contact@linepicplus.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://linepicplus.com',
        description: 'Production server',
      },
    ],
    tags: [
      {
        name: 'Products',
        description: 'Product management endpoints',
      },
      {
        name: 'Orders',
        description: 'Order management endpoints',
      },
      {
        name: 'Upload',
        description: 'File upload endpoints',
      },
      {
        name: 'Payments',
        description: 'Stripe payment endpoints',
      },
      {
        name: 'Health',
        description: 'Health check endpoints',
      },
    ],
    components: {
      schemas: {
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            slug: { type: 'string' },
            price: { type: 'string' },
            regular_price: { type: 'string' },
            sale_price: { type: 'string' },
            description: { type: 'string' },
            short_description: { type: 'string' },
            images: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  src: { type: 'string' },
                  name: { type: 'string' },
                  alt: { type: 'string' },
                },
              },
            },
            categories: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  name: { type: 'string' },
                  slug: { type: 'string' },
                },
              },
            },
            status: { type: 'string', enum: ['publish', 'draft', 'pending'] },
            featured: { type: 'boolean' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            order_key: { type: 'string' },
            status: { 
              type: 'string', 
              enum: ['pending', 'processing', 'on-hold', 'completed', 'cancelled', 'refunded', 'failed'] 
            },
            currency: { type: 'string' },
            date_created: { type: 'string', format: 'date-time' },
            date_modified: { type: 'string', format: 'date-time' },
            total: { type: 'string' },
            total_tax: { type: 'string' },
            discount_total: { type: 'string' },
            payment_method: { type: 'string' },
            payment_method_title: { type: 'string' },
            billing: { type: 'object' },
            shipping: { type: 'object' },
            line_items: { type: 'array' },
            shipping_lines: { type: 'array' },
            coupon_lines: { type: 'array' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './dist/routes/*.js'], // Support both TS and compiled JS
};

export const swaggerSpec = swaggerJsdoc(options);


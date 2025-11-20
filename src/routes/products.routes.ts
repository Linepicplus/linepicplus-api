/**
 * Products Routes
 * GET /products - Get products list with pagination and filters
 * GET /product - Get single product by query params
 */

import { Router, Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { ProductQueryParams } from '../models/product.model';

const router = Router();

/**
 * @swagger
 * /products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get products list
 *     description: Retrieve a list of products with pagination and filters
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *       - in: query
 *         name: min_price
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: max_price
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category slug filter
 *       - in: query
 *         name: featured
 *         schema:
 *           type: integer
 *         description: Get featured products (1 for featured)
 *     responses:
 *       200:
 *         description: Products list retrieved successfully
 *         headers:
 *           x-wp-total:
 *             schema:
 *               type: integer
 *             description: Total number of products
 *           x-wp-totalpages:
 *             schema:
 *               type: integer
 *             description: Total number of pages
 */
router.get('/products', async (req: Request, res: Response) => {
  try {
    const params: ProductQueryParams = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      per_page: req.query.per_page ? parseInt(req.query.per_page as string) : 10,
      search: req.query.search as string,
      min_price: req.query.min_price ? parseFloat(req.query.min_price as string) : undefined,
      max_price: req.query.max_price ? parseFloat(req.query.max_price as string) : undefined,
      category: req.query.category as string,
      featured: req.query.featured ? parseInt(req.query.featured as string) : undefined,
    };

    const result = await ProductService.getProducts(params);

    // Set pagination headers
    res.setHeader('x-wp-total', result.total.toString());
    res.setHeader('x-wp-totalpages', result.totalPages.toString());

    res.json(result.data);
  } catch (error) {
    console.error('[Products Route] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /product:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get single product
 *     description: Retrieve a single product by ID or other query parameters
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *       404:
 *         description: Product not found
 */
router.get('/product', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.query.id as string);

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const product = await ProductService.getProductById(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('[Product Route] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


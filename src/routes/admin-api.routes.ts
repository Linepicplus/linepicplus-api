/**
 * Admin API Routes
 * CRUD operations for admin panel
 */

import { Router, Request, Response } from 'express';
import multer from 'multer';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/order.service';
import { CouponService } from '../services/coupon.service';
import { UploadService } from '../services/upload.service';
import { ProductImageService } from '../services/product-image.service';
import { requireAdmin } from '../middleware/auth.middleware';

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

const router = Router();

// Apply admin authentication to all routes
router.use(requireAdmin);

// ============ ORDERS ============

router.get('/orders', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.per_page as string) || 20;
    
    // Get all orders (simple implementation)
    const db = await import('../services/database.service').then(m => m.DatabaseService.getInstance());
    const allOrders = await db.findMany('orders', {});
    
    const total = allOrders.length;
    const skip = (page - 1) * perPage;
    const orders = allOrders.slice(skip, skip + perPage);

    res.json({
      orders,
      pagination: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    });
  } catch (error) {
    console.error('[Admin Orders] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/orders/:id', async (req: Request, res: Response) => {
  try {
    const order = await OrderService.getOrderById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('[Admin Order Detail] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/orders/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const order = await OrderService.updateOrderStatus(req.params.id, status);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('[Admin Update Order Status] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============ PRODUCTS ============

router.get('/products', async (req: Request, res: Response) => {
  try {
    const result = await ProductService.getProducts({
      page: parseInt(req.query.page as string) || 1,
      per_page: parseInt(req.query.per_page as string) || 20,
      search: req.query.search as string,
    });

    res.json(result);
  } catch (error) {
    console.error('[Admin Products] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/products/:id', async (req: Request, res: Response) => {
  try {
    const product = await ProductService.getProductById(parseInt(req.params.id));
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('[Admin Product Detail] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/products', async (req: Request, res: Response) => {
  try {
    const product = await ProductService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error('[Admin Create Product] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/products/:id', async (req: Request, res: Response) => {
  try {
    const product = await ProductService.updateProduct(parseInt(req.params.id), req.body);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('[Admin Update Product] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/products/:id', async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id);
    
    // Delete product images
    await ProductImageService.deleteProductImages(productId);
    
    const deleted = await ProductService.deleteProduct(productId);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('[Admin Delete Product] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload product image
router.post('/products/:id/upload-image', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const productId = parseInt(req.params.id);
    const imageUrl = await ProductImageService.saveImage(productId, req.file);

    res.json({
      success: true,
      url: imageUrl,
      image: {
        src: imageUrl,
        id: Date.now(),
        name: req.file.originalname,
        alt: req.file.originalname,
      },
    });
  } catch (error) {
    console.error('[Admin Upload Product Image] Error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Delete product image
router.delete('/products/:id/images', async (req: Request, res: Response) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    const deleted = await ProductImageService.deleteImage(imageUrl);

    if (!deleted) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('[Admin Delete Product Image] Error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// ============ COUPONS ============

router.get('/coupons', async (req: Request, res: Response) => {
  try {
    const db = await import('../services/database.service').then(m => m.DatabaseService.getInstance());
    const coupons = await db.findMany('coupons', {});

    res.json(coupons);
  } catch (error) {
    console.error('[Admin Coupons] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/coupons', async (req: Request, res: Response) => {
  try {
    const coupon = await CouponService.createCoupon(req.body);
    res.status(201).json(coupon);
  } catch (error) {
    console.error('[Admin Create Coupon] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/coupons/:id', async (req: Request, res: Response) => {
  try {
    const db = await import('../services/database.service').then(m => m.DatabaseService.getInstance());
    const deleted = await db.deleteOne('coupons', req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('[Admin Delete Coupon] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============ UPLOADS ============

router.get('/uploads', async (req: Request, res: Response) => {
  try {
    const db = await import('../services/database.service').then(m => m.DatabaseService.getInstance());
    const uploads = await db.findMany('uploads', {});

    res.json(uploads);
  } catch (error) {
    console.error('[Admin Uploads] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/uploads/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await UploadService.deleteFile(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Upload not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('[Admin Delete Upload] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============ STATS ============

router.get('/stats', async (req: Request, res: Response) => {
  try {
    const db = await import('../services/database.service').then(m => m.DatabaseService.getInstance());
    
    const orders = await db.findMany('orders', {});
    const products = await db.findMany('products', {});
    const coupons = await db.findMany('coupons', {});
    const uploads = await db.findMany('uploads', {});

    // Calculate revenue
    const totalRevenue = orders.reduce((sum: number, order: any) => {
      if (order.status === 'completed' || order.status === 'processing') {
        return sum + parseFloat(order.total || '0');
      }
      return sum;
    }, 0);

    // Orders by status
    const ordersByStatus = orders.reduce((acc: any, order: any) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    res.json({
      totalOrders: orders.length,
      totalProducts: products.length,
      totalCoupons: coupons.length,
      totalUploads: uploads.length,
      totalRevenue: totalRevenue.toFixed(2),
      ordersByStatus,
    });
  } catch (error) {
    console.error('[Admin Stats] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


/**
 * Orders Routes
 * POST /orders - Create new order
 * POST /order-billing-shipping - Update order billing and shipping address
 * POST /order-coupon - Apply coupon to order
 * GET /track-orders - Track multiple orders
 */

import { Router, Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { CouponService } from '../services/coupon.service';
import { OrderCreateDTO, OrderUpdateAddressDTO, OrderUpdateCouponDTO } from '../models/order.model';

const router = Router();

/**
 * @swagger
 * /orders:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Create new order
 *     description: Create a new order with billing, shipping, and line items
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - billing
 *               - shipping
 *               - line_items
 *             properties:
 *               payment_method:
 *                 type: string
 *                 default: stripe
 *               payment_method_title:
 *                 type: string
 *                 default: Carte de paiement (Stripe)
 *               set_paid:
 *                 type: boolean
 *                 default: false
 *               billing:
 *                 type: object
 *               shipping:
 *                 type: object
 *               line_items:
 *                 type: array
 *               shipping_lines:
 *                 type: array
 *     responses:
 *       200:
 *         description: Order created successfully
 *       400:
 *         description: Invalid data
 */
router.post('/orders', async (req: Request, res: Response) => {
  try {
    const data: OrderCreateDTO = req.body;

    // Force set_paid to false and status to pending
    data.set_paid = false;
    data.status = 'pending';

    const order = await OrderService.createOrder(data);

    res.json(order);
  } catch (error) {
    console.error('[Orders Route] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /order-billing-shipping:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Update order billing and shipping address
 *     parameters:
 *       - in: query
 *         name: order-id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - billing
 *               - shipping
 *             properties:
 *               billing:
 *                 type: object
 *               shipping:
 *                 type: object
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       404:
 *         description: Order not found
 */
router.post('/order-billing-shipping', async (req: Request, res: Response) => {
  try {
    const orderId = req.query['order-id'] as string;

    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    const data: OrderUpdateAddressDTO = req.body;
    const order = await OrderService.updateOrderAddress(orderId, data);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('[Order Billing Shipping Route] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /order-coupon:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Apply coupon to order
 *     parameters:
 *       - in: query
 *         name: order-id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - coupon_lines
 *             properties:
 *               coupon_lines:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *     responses:
 *       200:
 *         description: Coupon applied successfully
 *       400:
 *         description: Invalid coupon
 *       404:
 *         description: Order not found
 *       409:
 *         description: Coupon already used
 */
router.post('/order-coupon', async (req: Request, res: Response) => {
  try {
    const orderId = req.query['order-id'] as string;

    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    const data: OrderUpdateCouponDTO = req.body;

    if (!data.coupon_lines || data.coupon_lines.length === 0) {
      return res.status(400).json({ error: 'Coupon code is required' });
    }

    // Get order
    const order = await OrderService.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if coupon already applied
    if (order.coupon_lines && order.coupon_lines.length > 0) {
      return res.status(409).json({ 
        code: 'woocommerce_rest_invalid_coupon',
        message: 'Vous utilisez déjà un code promo',
        data: { status: 409 }
      });
    }

    // Calculate order subtotal (before discount)
    const orderSubtotal = order.line_items.reduce((sum, item) => {
      return sum + parseFloat(item.total || '0');
    }, 0);

    // Validate coupon
    const couponCode = data.coupon_lines[0].code;
    const validation = await CouponService.validateCoupon(
      couponCode, 
      orderSubtotal, 
      order.billing.email
    );

    if (!validation.valid) {
      return res.status(400).json({ 
        code: 'woocommerce_rest_invalid_coupon',
        message: validation.message,
        data: { status: 400 }
      });
    }

    // Apply coupon
    const updatedCouponLines = [{
      code: couponCode,
      discount: validation.discount?.toFixed(2) || '0',
      discount_tax: '0',
    }];

    const updatedOrder = await OrderService.updateOrderCoupon(orderId, {
      coupon_lines: updatedCouponLines,
    });

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Increment coupon usage
    await CouponService.incrementCouponUsage(couponCode, order.billing.email);

    res.json(updatedOrder);
  } catch (error) {
    console.error('[Order Coupon Route] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /track-orders:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Track multiple orders
 *     parameters:
 *       - in: query
 *         name: order-id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comma-separated list of order IDs
 *     responses:
 *       200:
 *         description: Order tracking information retrieved successfully
 */
router.get('/track-orders', async (req: Request, res: Response) => {
  try {
    const orderIds = (req.query['order-id'] as string)?.split(',') || [];

    if (orderIds.length === 0) {
      return res.status(400).json({ error: 'Order IDs are required' });
    }

    const tracking = await OrderService.getOrderTracking(orderIds);

    res.json(tracking);
  } catch (error) {
    console.error('[Track Orders Route] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


/**
 * Payments Routes
 * POST /create-intent - Create Stripe Payment Intent
 * POST /confirm-intent - Confirm Stripe Payment Intent
 */

import { Router, Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';
import { OrderService } from '../services/order.service';
import { CreatePaymentIntentDTO } from '../models/payment.model';

const router = Router();

/**
 * @swagger
 * /create-intent:
 *   post:
 *     tags:
 *       - Payments
 *     summary: Create Stripe Payment Intent
 *     parameters:
 *       - in: query
 *         name: amount
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment amount (e.g., "49.99")
 *       - in: query
 *         name: description
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment description
 *     responses:
 *       200:
 *         description: Payment Intent created successfully
 *       400:
 *         description: Invalid parameters
 *       500:
 *         description: Stripe error
 */
router.post('/create-intent', async (req: Request, res: Response) => {
  try {
    const amount = req.query.amount as string;
    const description = req.query.description as string;

    if (!amount || !description) {
      return res.status(400).json({ 
        error: 'Missing required parameters: amount and description' 
      });
    }

    // Extract order_id from description (format: "Linepicplus - Command 12345")
    let orderId: string | undefined;
    const descParts = description.split(' ');
    if (descParts.length === 4 && descParts[0] === 'Linepicplus' && descParts[2] === 'Command') {
      orderId = descParts[3];
    }

    const data: CreatePaymentIntentDTO = {
      amount,
      description,
      order_id: orderId,
    };

    const paymentIntent = await PaymentService.createPaymentIntent(data);

    res.json({
      id: paymentIntent.id,
      client_secret: paymentIntent.client_secret,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      object: 'payment_intent',
    });
  } catch (error: any) {
    console.error('[Create Intent Route] Error:', error);
    res.status(500).json({ 
      error: 'Failed to create payment intent',
      message: error.message,
    });
  }
});

/**
 * @swagger
 * /confirm-intent:
 *   post:
 *     tags:
 *       - Payments
 *     summary: Confirm Stripe Payment Intent
 *     parameters:
 *       - in: query
 *         name: intent-id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment Intent ID
 *     responses:
 *       200:
 *         description: Payment Intent confirmed
 *       400:
 *         description: Invalid Intent ID
 *       404:
 *         description: Intent not found
 *       500:
 *         description: Stripe error
 */
router.post('/confirm-intent', async (req: Request, res: Response) => {
  try {
    const intentId = req.query['intent-id'] as string;

    if (!intentId) {
      return res.status(400).json({ error: 'Intent ID is required' });
    }

    const result = await PaymentService.confirmPaymentIntent(intentId);

    // If payment succeeded, update order status
    if (result.paymentStatus === 'succeeded') {
      // Get payment intent to find order_id from database
      const paymentIntent = await PaymentService.getPaymentIntent(intentId);
      
      let orderId: string | undefined = paymentIntent?.order_id;

      // If not in DB, try to extract from description (fallback)
      if (!orderId && paymentIntent?.description) {
        const descParts = paymentIntent.description.split(' ');
        if (descParts.length === 4 && descParts[0] === 'Linepicplus' && descParts[2] === 'Command') {
          orderId = descParts[3];
        }
      }
      
      if (orderId) {
        // Check if order exists and is in pending status
        const order = await OrderService.getOrderById(orderId);
        
        if (!order) {
          console.log(`[Confirm Intent] Order ${orderId} not found or deleted`);
          return res.json({ 
            paymentStatus: result.paymentStatus,
            id: result.id,
            order_id: orderId,
            order_status: 'deleted'
          });
        }

        // Only update if order is still pending
        if (order.status === 'pending') {
          await OrderService.updateOrderStatus(orderId, 'processing');
          console.log(`[Confirm Intent] Updated order ${orderId} from pending to processing`);
        } else {
          console.log(`[Confirm Intent] Order ${orderId} already in status ${order.status}, not updating`);
        }
      } else {
        console.warn('[Confirm Intent] No order_id found in payment intent');
      }
    }

    res.json(result);
  } catch (error: any) {
    console.error('[Confirm Intent Route] Error:', error);
    
    if (error.type === 'StripeInvalidRequestError') {
      return res.status(404).json({ 
        error: 'Payment intent not found',
        message: error.message,
      });
    }

    res.status(500).json({ 
      error: 'Failed to confirm payment intent',
      message: error.message,
    });
  }
});

export default router;


/**
 * Order Service
 * Business logic for orders
 */

import { DatabaseService } from './database.service';
import { ProductService } from './product.service';
import { 
  Order, 
  OrderCreateDTO, 
  OrderUpdateAddressDTO, 
  OrderUpdateCouponDTO,
  OrderTrackingResponse,
  LineItem
} from '../models/order.model';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

export class OrderService {
  private static COLLECTION = 'orders';

  private static generateOrderKey(): string {
    return 'wc_order_' + crypto.randomBytes(16).toString('hex');
  }

  private static calculateOrderTotal(lineItems: LineItem[], couponDiscount: string = '0'): string {
    const subtotal = lineItems.reduce((sum, item) => {
      const itemTotal = parseFloat(item.total || '0');
      return sum + itemTotal;
    }, 0);

    const discount = parseFloat(couponDiscount);
    const total = subtotal - discount;

    return total.toFixed(2);
  }

  static async createOrder(data: OrderCreateDTO): Promise<Order> {
    const db = DatabaseService.getInstance();
    
    // Calculate line item totals by fetching product prices
    const lineItems: LineItem[] = [];
    
    for (const item of data.line_items) {
      const product = await ProductService.getProductById(item.product_id);
      
      if (!product) {
        throw new Error(`Product ${item.product_id} not found`);
      }

      const unitPrice = parseFloat(product.price);
      const quantity = item.quantity;
      const itemTotal = unitPrice * quantity;

      lineItems.push({
        ...item,
        id: uuidv4(),
        name: product.name,
        subtotal: itemTotal.toFixed(2),
        total: itemTotal.toFixed(2),
      });
    }

    // Calculate totals
    const discount_total = data.coupon_lines?.[0]?.discount || '0';
    const total = this.calculateOrderTotal(lineItems, discount_total);

    const order: Partial<Order> = {
      id: uuidv4(),
      order_key: this.generateOrderKey(),
      status: data.status || 'pending',
      currency: 'EUR',
      date_created: new Date().toISOString(),
      date_modified: new Date().toISOString(),
      payment_method: data.payment_method || 'stripe',
      payment_method_title: data.payment_method_title || 'Carte de paiement (Stripe)',
      set_paid: data.set_paid || false,
      billing: data.billing,
      shipping: data.shipping,
      line_items: lineItems,
      shipping_lines: data.shipping_lines || [{
        id: uuidv4(),
        method_id: 'lpc_nosign',
        method_title: 'Colissimo sans signature',
        total: '0'
      }],
      coupon_lines: data.coupon_lines || [],
      total,
      total_tax: '0',
      discount_total,
    };

    return db.create<Order>(this.COLLECTION, order);
  }

  static async getOrderById(id: string): Promise<Order | null> {
    const db = DatabaseService.getInstance();
    return db.findById<Order>(this.COLLECTION, id);
  }

  static async updateOrderAddress(id: string, data: OrderUpdateAddressDTO): Promise<Order | null> {
    const db = DatabaseService.getInstance();
    return db.updateOne<Order>(this.COLLECTION, id, {
      billing: data.billing,
      shipping: data.shipping,
      date_modified: new Date().toISOString(),
    });
  }

  static async updateOrderCoupon(id: string, data: OrderUpdateCouponDTO): Promise<Order | null> {
    const db = DatabaseService.getInstance();
    const order = await this.getOrderById(id);

    if (!order) {
      return null;
    }

    // Calculate new total with coupon
    const couponDiscount = data.coupon_lines[0]?.discount || '0';
    const newTotal = this.calculateOrderTotal(order.line_items, couponDiscount);

    return db.updateOne<Order>(this.COLLECTION, id, {
      coupon_lines: data.coupon_lines,
      discount_total: couponDiscount,
      total: newTotal,
      date_modified: new Date().toISOString(),
    });
  }

  static async getOrderTracking(orderIds: string[]): Promise<OrderTrackingResponse[]> {
    const db = DatabaseService.getInstance();
    const results: OrderTrackingResponse[] = [];

    for (const orderId of orderIds) {
      const order = await this.getOrderById(orderId);
      if (order) {
        results.push({
          id: order.id,
          status: order.status,
          tracking: order.tracking_number,
        });
      }
    }

    return results;
  }

  static async updateOrderStatus(id: string, status: string): Promise<Order | null> {
    const db = DatabaseService.getInstance();
    return db.updateOne<Order>(this.COLLECTION, id, {
      status: status as any,
      date_modified: new Date().toISOString(),
    });
  }
}


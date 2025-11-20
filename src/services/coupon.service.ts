/**
 * Coupon Service
 * Business logic for coupons
 */

import { DatabaseService } from './database.service';
import { Coupon, CouponCreateDTO, CouponValidationResult } from '../models/coupon.model';
import { v4 as uuidv4 } from 'uuid';

export class CouponService {
  private static COLLECTION = 'coupons';

  static async getCouponByCode(code: string): Promise<Coupon | null> {
    const db = DatabaseService.getInstance();
    return db.findOne<Coupon>(this.COLLECTION, { code: code.toUpperCase() });
  }

  static async createCoupon(data: CouponCreateDTO): Promise<Coupon> {
    const db = DatabaseService.getInstance();
    
    const coupon: Partial<Coupon> = {
      id: uuidv4(),
      code: data.code.toUpperCase(),
      amount: data.amount,
      type: data.type,
      description: data.description || '',
      date_expires: data.date_expires,
      usage_count: 0,
      usage_limit: data.usage_limit,
      usage_limit_per_user: data.usage_limit_per_user,
      individual_use: data.individual_use || false,
      product_ids: data.product_ids || [],
      excluded_product_ids: data.excluded_product_ids || [],
      minimum_amount: data.minimum_amount,
      maximum_amount: data.maximum_amount,
      email_restrictions: data.email_restrictions || [],
      used_by: [],
      active: true,
    };

    return db.create<Coupon>(this.COLLECTION, coupon);
  }

  static async validateCoupon(
    code: string, 
    orderTotal: number, 
    email?: string
  ): Promise<CouponValidationResult> {
    const coupon = await this.getCouponByCode(code);

    if (!coupon) {
      return {
        valid: false,
        message: 'Le code promo est invalide',
      };
    }

    if (!coupon.active) {
      return {
        valid: false,
        message: 'Le code promo est inactif',
      };
    }

    // Check expiration
    if (coupon.date_expires) {
      const expiryDate = new Date(coupon.date_expires);
      if (expiryDate < new Date()) {
        return {
          valid: false,
          message: 'Le code promo a expiré',
        };
      }
    }

    // Check usage limit
    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      return {
        valid: false,
        message: 'Le code promo a atteint sa limite d\'utilisation',
      };
    }

    // Check email restrictions
    if (coupon.email_restrictions && coupon.email_restrictions.length > 0 && email) {
      if (!coupon.email_restrictions.includes(email)) {
        return {
          valid: false,
          message: 'Ce code promo n\'est pas valide pour votre adresse email',
        };
      }
    }

    // Check minimum amount
    if (coupon.minimum_amount && orderTotal < parseFloat(coupon.minimum_amount)) {
      return {
        valid: false,
        message: `Montant minimum requis: ${coupon.minimum_amount}€`,
      };
    }

    // Check maximum amount
    if (coupon.maximum_amount && orderTotal > parseFloat(coupon.maximum_amount)) {
      return {
        valid: false,
        message: `Montant maximum autorisé: ${coupon.maximum_amount}€`,
      };
    }

    // Calculate discount
    let discount = 0;
    if (coupon.type === 'fixed_cart') {
      discount = parseFloat(coupon.amount);
    } else if (coupon.type === 'percent') {
      discount = (orderTotal * parseFloat(coupon.amount)) / 100;
    }

    return {
      valid: true,
      discount,
      coupon,
    };
  }

  static async incrementCouponUsage(code: string, email?: string): Promise<void> {
    const db = DatabaseService.getInstance();
    const coupon = await this.getCouponByCode(code);

    if (coupon) {
      const usedBy = email ? [...(coupon.used_by || []), email] : coupon.used_by;
      await db.updateOne<Coupon>(this.COLLECTION, coupon.id, {
        usage_count: coupon.usage_count + 1,
        used_by: usedBy,
      });
    }
  }
}


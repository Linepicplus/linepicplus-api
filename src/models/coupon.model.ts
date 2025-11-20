/**
 * Coupon Model
 * Based on WooCommerce coupon structure
 */

export type CouponType = 'fixed_cart' | 'percent' | 'fixed_product' | 'percent_product';

export interface Coupon {
  id: string;
  code: string;
  amount: string;
  type: CouponType;
  description?: string;
  date_expires?: string;
  usage_count: number;
  usage_limit?: number;
  usage_limit_per_user?: number;
  individual_use: boolean;
  product_ids?: number[];
  excluded_product_ids?: number[];
  minimum_amount?: string;
  maximum_amount?: string;
  email_restrictions?: string[];
  used_by?: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CouponCreateDTO {
  code: string;
  amount: string;
  type: CouponType;
  description?: string;
  date_expires?: string;
  usage_limit?: number;
  usage_limit_per_user?: number;
  individual_use?: boolean;
  product_ids?: number[];
  excluded_product_ids?: number[];
  minimum_amount?: string;
  maximum_amount?: string;
  email_restrictions?: string[];
}

export interface CouponValidationResult {
  valid: boolean;
  message?: string;
  discount?: number;
  coupon?: Coupon;
}


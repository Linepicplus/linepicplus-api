/**
 * Order Model
 * Based on WooCommerce order structure
 */

export interface BillingAddress {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email: string;
  phone: string;
}

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

export interface LineItem {
  id?: string;
  product_id: number;
  name?: string;
  quantity: number;
  subtotal?: string;
  total?: string;
  meta_data?: Array<{
    key: string;
    value: any;
  }>;
}

export interface ShippingLine {
  id?: string;
  method_id: string;
  method_title: string;
  total: string;
}

export interface CouponLine {
  id?: string;
  code: string;
  discount?: string;
  discount_tax?: string;
}

export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'on-hold'
  | 'completed'
  | 'cancelled'
  | 'refunded'
  | 'failed';

export interface Order {
  id: string;
  order_key: string;
  status: OrderStatus;
  currency: string;
  date_created: string;
  date_modified: string;
  total: string;
  total_tax: string;
  discount_total: string;
  payment_method: string;
  payment_method_title: string;
  set_paid: boolean;
  billing: BillingAddress;
  shipping: ShippingAddress;
  line_items: LineItem[];
  shipping_lines: ShippingLine[];
  coupon_lines: CouponLine[];
  tracking_number?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderCreateDTO {
  payment_method?: string;
  payment_method_title?: string;
  set_paid?: boolean;
  status?: OrderStatus;
  billing: BillingAddress;
  shipping: ShippingAddress;
  line_items: LineItem[];
  shipping_lines?: ShippingLine[];
  coupon_lines?: CouponLine[];
}

export interface OrderUpdateAddressDTO {
  billing: BillingAddress;
  shipping: ShippingAddress;
}

export interface OrderUpdateCouponDTO {
  coupon_lines: CouponLine[];
}

export interface OrderTrackingResponse {
  id: string;
  status: OrderStatus;
  tracking?: string;
}


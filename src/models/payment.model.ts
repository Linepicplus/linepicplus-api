/**
 * Payment Model
 * For Stripe payment intents
 */

export interface PaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  description?: string;
  order_id?: string;
  metadata?: {
    order_id?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type PaymentStatus = 
  | 'succeeded'
  | 'processing'
  | 'requires_payment_method'
  | 'requires_confirmation'
  | 'requires_action'
  | 'canceled'
  | 'failed';

export interface CreatePaymentIntentDTO {
  amount: string;
  description: string;
  order_id?: string;
}

export interface ConfirmPaymentIntentResponse {
  paymentStatus: PaymentStatus;
  id: string;
  amount: number;
  currency: string;
}


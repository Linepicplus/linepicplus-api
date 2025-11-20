/**
 * Payment Service
 * Business logic for Stripe payments
 */

import Stripe from 'stripe';
import { DatabaseService } from './database.service';
import { PaymentIntent, CreatePaymentIntentDTO, ConfirmPaymentIntentResponse } from '../models/payment.model';

export class PaymentService {
  private static stripe: Stripe;
  private static COLLECTION = 'payment_intents';

  static initialize(secretKey: string): void {
    this.stripe = new Stripe(secretKey, {
    //   apiVersion: '2024-11-20.acacia',
    });
  }

  static async createPaymentIntent(data: CreatePaymentIntentDTO): Promise<PaymentIntent> {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    const db = DatabaseService.getInstance();

    // Convert amount to cents (Stripe requires integer cents)
    const amountInCents = Math.round(parseFloat(data.amount) * 100);

    // Create Stripe Payment Intent with metadata
    const stripeIntent = await this.stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'eur',
      description: data.description,
      metadata: data.order_id ? { order_id: data.order_id } : {},
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Save to database
    const paymentIntent: Partial<PaymentIntent> = {
      id: stripeIntent.id,
      client_secret: stripeIntent.client_secret!,
      amount: amountInCents,
      currency: stripeIntent.currency,
      status: stripeIntent.status as any,
      description: data.description,
      order_id: data.order_id,
      metadata: stripeIntent.metadata as any,
    };

    return db.create<PaymentIntent>(this.COLLECTION, paymentIntent);
  }

  static async confirmPaymentIntent(intentId: string): Promise<ConfirmPaymentIntentResponse> {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    const db = DatabaseService.getInstance();

    // Retrieve Stripe Payment Intent
    const stripeIntent = await this.stripe.paymentIntents.retrieve(intentId);

    // Update database
    await db.updateOne<PaymentIntent>(this.COLLECTION, intentId, {
      status: stripeIntent.status as any,
    });

    return {
      paymentStatus: stripeIntent.status as any,
      id: stripeIntent.id,
      amount: stripeIntent.amount,
      currency: stripeIntent.currency,
    };
  }

  static async getPaymentIntent(intentId: string): Promise<PaymentIntent | null> {
    const db = DatabaseService.getInstance();
    return db.findById<PaymentIntent>(this.COLLECTION, intentId);
  }
}


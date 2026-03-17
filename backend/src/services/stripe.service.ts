import Stripe from "stripe";
import { Currency } from "../types/payment.types";
import {env} from '../config/env.ts'

export class StripeService {
  private stripe: Stripe;

  constructor(private secretKey: string) {
    this.stripe = new Stripe(secretKey, {
      apiVersion: "2026-02-25.clover",
    });
  }

  createPaymentIntent(input: {
    amount: number;
    currency: Currency;
    userId: string;
    idempotencyKey: string;
  }) {
    return this.stripe.paymentIntents.create(
      {
        amount: input.amount,
        currency: input.currency,
        metadata: { userId: input.userId },
      },
      { idempotencyKey: input.idempotencyKey },
    );

    verifyWebhook(signature: string, payload: Buffer){
        return this.stripe.webhooks.constructEvent(payload, signature, env.STRIPE_WEBHOOK_SECRET)
    }
  }
}

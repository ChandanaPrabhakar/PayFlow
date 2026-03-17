import Stripe from "stripe";

export type StripeEvent =
  | Stripe.PaymentIntentSucceededEvent
  | Stripe.PaymentIntentPaymentFailedEvent;

export interface WebhookEventRecord {
  id: string; //Stripe event id
  type: string;
  processed: boolean;
  createdAt: Date;
}

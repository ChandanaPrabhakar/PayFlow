import Stripe from "stripe";
import { PaymentRepository } from "../repositories/payment.repository";
import { WebhookEventRepository } from "../repositories/webhook-event.repository";

export class PaymentService {
  constructor(
    private paymentRepo: PaymentRepository,
    private webhookEventRepo: WebhookEventRepository,
  ) {}

  async processWebhook(event: Stripe.Event) {
    const isNew = await this.webhookEventRepo.insertIfNotExists(
      event.id,
      event.type,
    );

    if (!isNew) {
      return;
    }

    try {
      switch (event.type) {
        case "payment_intent.succeeded": {
          const intent = event.data.object as Stripe.PaymentIntent;
          await this.paymentRepo.markSucceeded(intent.id);
          break;
        }
        case "payment_intent.payment_failed": {
          const intent = event.data.object as Stripe.PaymentIntent;
          await this.paymentRepo.markFailed(intent.id);
          break;
        }

        default:
          break;
      }

      await this.webhookEventRepo.markProcessed(event.id);
    } catch (error) {
      throw error;
    }
  }
}

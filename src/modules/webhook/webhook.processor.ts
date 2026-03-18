// src/modules/webhook/webhook.processor.ts
import { WebhookEventRepository } from "./webhook.repository.ts";
import { TransactionRepository } from "../transaction/transaction.repository.ts";

const webhookEventRepository = new WebhookEventRepository();
const transactionRepository = new TransactionRepository();

export class WebhookProcessor {
  async processEvent(event: any) {
    console.log(`Processing event ${event.id} (${event.type})`);

    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi = event.payload?.data?.object;

        console.log("Webhook PI ID:", pi.id);

        const tx = await transactionRepository.findById(pi.id);

        if (!tx) {
          console.warn("Transaction not found, will retry:", pi.id);
          return;
        }

        console.log("Before update:", tx);

        await transactionRepository.paymentStatus(pi.id, "SUCCEEDED", event.id);

        const updated = await transactionRepository.findById(pi.id);

        console.log("After update:", updated);

        await webhookEventRepository.markProcess(event.id);
        break;
      }

      case "payment_intent.payment_failed": {
        const pi = event.payload?.data?.object;

        await transactionRepository.paymentStatus(pi.id, "FAILED", event.id);

        console.log("Transaction marked FAILED:", pi.id);

        await webhookEventRepository.markProcess(event.id);
        break;
      }

      default:
        console.log("Unhandled event:", event.type);
        await webhookEventRepository.markProcess(event.id);
    }
  }

  async processPendingEvents() {
    const events = await webhookEventRepository.getUnprocessedEvent();

    for (const event of events) {
      try {
        await this.processEvent(event);
      } catch (err) {
        console.error("Failed processing event:", event.id);
        console.log(err);
        // DO NOT mark processed → retry later
      }
    }
  }
}

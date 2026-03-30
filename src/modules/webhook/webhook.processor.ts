import { WebhookEventRepository } from "./webhook.repository.ts";
import { TransactionRepository } from "../transaction/transaction.repository.ts";
import { ReceiptRepository } from "../receipt/receipt.repository.ts";
import { generateReceiptPDF } from "../../utils/pdf.ts";
import { sendReceiptEmail } from "../../utils/email.ts";

const receiptRepository = new ReceiptRepository();

const webhookEventRepository = new WebhookEventRepository();
const transactionRepository = new TransactionRepository();

export class WebhookProcessor {
  async processEvent(event: any) {
    console.log(`Processing event ${event.id} (${event.type})`);

    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi = event.payload.data.object;

        const tx = await transactionRepository.findById(pi.id);

        if (!tx) {
          await webhookEventRepository.markProcess(event.id);
          return;
        }

        if (tx.status === "SUCCEEDED") {
          await webhookEventRepository.markProcess(event.id);
          return;
        }

        await transactionRepository.paymentStatus(pi.id, "SUCCEEDED", event.id);

        const filePath = await generateReceiptPDF({
          transactionId: tx.id,
          amount: tx.amount,
          currency: tx.currency,
          email: tx.email!,
        });

        await receiptRepository.createReceipt({
          transactionId: tx.id,
          url: filePath,
          email: tx.email!,
        });

        await sendReceiptEmail({
          email: tx.email!,
          filePath,
        }).catch(console.error);

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

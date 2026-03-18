import { stripe } from "../../config/stripe.ts";
import { TransactionRepository } from "./transaction.repository.ts";

const transactionRepository = new TransactionRepository();

export class TransactionService {
  async createPaymentIntent(input: {
    amount: number;
    currency: string;
    userId?: string;
    email?: string;
  }) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: input.amount,
      currency: input.currency,
      receipt_email: input.email,
      metadata: {
        userId: input.userId || "",
      },
    });

    await transactionRepository.createTransaction({
      id: paymentIntent.id,
      userId: input.userId || "",
      amount: input.amount,
      currency: input.currency,
      status: "PENDING",
      stripeEventId: "",
    });
    return {
      ClientSecret: paymentIntent.client_secret,
    };
  }
}

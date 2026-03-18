import { stripe } from "../../config/stripe.ts";
import { AppError } from "../../utils/AppError.ts";
import { TransactionRepository } from "./transaction.repository.ts";

const transactionRepository = new TransactionRepository();

export class TransactionService {
  async createPaymentIntent(input: {
    amount: number;
    currency: string;
    userId?: string;
    email?: string;
  }) {
    if (input.amount < 3000) {
      throw new AppError("Amount too small (min ₹30)", 400);
    }
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
      userId: input.userId,
      amount: input.amount,
      currency: input.currency,
      status: "PENDING",
    });
    return {
      clientSecret: paymentIntent.client_secret,
    };
  }
}

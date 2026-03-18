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

    if (!Number.isInteger(input.amount)) {
      throw new AppError("Amount must be in smallest currency unit", 400);
    }

    const supportedCurrencies = ["inr", "usd"];
    if (!supportedCurrencies.includes(input.currency.toLowerCase())) {
      throw new AppError("Unsupported currency", 400);
    }

    let paymentIntent;

    try {
      paymentIntent = await stripe.paymentIntents.create({
        amount: input.amount,
        currency: input.currency,
        receipt_email: input.email,
        metadata: {
          userId: input.userId || "",
        },
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: "never",
        },
      });
    } catch (err) {
      console.error("Stripe Error:", err);
      throw new AppError("Failed to create payment intent", 500);
    }

    await transactionRepository.createTransaction({
      id: paymentIntent.id,
      userId: input.userId,
      amount: input.amount,
      currency: input.currency,
      email: input.email,
      status: "PENDING",
    });

    return {
      clientSecret: paymentIntent.client_secret,
    };
  }
}

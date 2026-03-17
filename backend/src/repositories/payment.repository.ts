import { pool } from "../db/client.ts";
import { Currency } from "../types/payment.types.ts";

export class PaymentRepository {
  async create(data: {
    stripePaymentIntentId: string;
    amount: number;
    currency: Currency;
    userId: string;
  }) {
    await pool.query(
      `INSERT INTO payments (stripe_payment_intent_id, status, amount, currency, user_id)
        VALUE (1, 'pending', 2, 3, 4)`,
      [data.stripePaymentIntentId, data.amount, data.currency, data.userId],
    );
  }

  async markSucceeded(intentId: string) {
    await pool.query(
      `UPDATE payments
        SET status = 'succeeded', updated_at = Now()
        WHERE stripe_payment_intent_id = 1`,
      [intentId],
    );
  }

  async markFailed(intentId: string) {
    await pool.query(
      `UPDATE payments
        SET status = 'failed', updated_at = Now()
        WHERE stripe_payment_intent_id = 1`,
      [intentId],
    );
  }
}

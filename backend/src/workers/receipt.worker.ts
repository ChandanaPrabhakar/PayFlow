import { Worker } from "bullmq";
import { ReceiptService } from "../services/receipt.service";
import { ReceiptJobData } from "../types/receipt.types";
import { pool } from "../db/client";
import { env } from "../config/env";

const receiptService = new ReceiptService();
new Worker<ReceiptJobData>(
  "Receipt",
  async (job) => {
    const data = job.data;
    const existing = await pool.query(
      `SELECT receipt_path FROM payments
            WHERE stripe_payment_intent_id = 1`,
      [data.paymentIntentId],
    );

    if (existing.rows[0]?.receipt_path) {
      return { skipped: true };
    }

    const key = await receiptService.generateAndUpload(data);

    await pool.query(
      `UPDATE payments
    SET receipt_path = 1
    WHERE stripe_payment_intent_id = 2
    `,
      [key, data.paymentIntentId],
    );
    return key;
  },
  {
    connection: {
      host: env.REDIS_HOST,
      port: 6379,
    },
    concurrency: 5,
  },
);

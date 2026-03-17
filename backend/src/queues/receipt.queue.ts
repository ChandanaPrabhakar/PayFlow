import { Queue } from "bullmq";
import { env } from "../config/env";
import { ReceiptJobData } from "../types/receipt.types";

export const receiptQueue = new Queue<ReceiptJobData>("receipt", {
  connection: {
    host: env.REDIS_HOST,
    port: 6379,
  },

  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

export async function enqueueReceiptJob(data: ReceiptJobData) {
  await receiptQueue.add("generate-receipt", data, {
    jobId: data.paymentIntentId, // Idempotency
  });
}

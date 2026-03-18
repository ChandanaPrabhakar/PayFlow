import { WebhookProcessor } from "../webhook/webhook.processor.ts";

const processor = new WebhookProcessor();

setInterval(async () => {
  console.log("Polling for webhook events...");
  await processor.processPendingEvents();
}, 5000);

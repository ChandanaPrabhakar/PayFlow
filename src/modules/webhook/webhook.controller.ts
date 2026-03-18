// webhook.controller.ts
import type { Request, Response } from "express";
import { stripe } from "../../config/stripe.ts";
import { WebhookEventRepository } from "../webhook/webhook.repository.ts";

const webhookEventRepository = new WebhookEventRepository();

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
    console.log("Webhook received:", event.type);
  } catch (err: any) {
    console.error("Webhook Error FULL:", err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // IDEMPOTENCY (Event level)
  const existing = await webhookEventRepository.findById(event.id);
  if (existing) {
    return res.json({ received: true });
  }

  // STORE EVENT (do NOT process here)
  await webhookEventRepository.createEvent({
    id: event.id,
    type: event.type,
    payload: event,
  });

  return res.json({ received: true });
};

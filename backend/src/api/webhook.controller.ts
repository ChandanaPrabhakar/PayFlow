import { Request, Response } from "express";
import { StripeService } from "../services/stripe.service.ts";
import { PaymentService } from "../services/payment.service.ts";

export class WebhookController {
  constructor(
    private stripeService: StripeService,
    private paymentService: PaymentService,
  ) {}

  handle = async (req: Request, res: Response) => {
    const signature = req.headers["Stripe-signature"] as string;

    if (!signature) {
      return res.status(400).send("Missing Signature");
    }

    let event;
    try {
      event = this.stripeService.verifyWebhook(signature, req.body as Buffer);
    } catch (error) {
      return res.status(400).send("Invalid signature");
    }

    try {
      await this.paymentService.processWebhook(event);
      res.status(200).send();
    } catch (error) {
      return res.status(500).send("Webhook processing failed");
    }
  };
}

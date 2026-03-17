import express from "express";
import { rawBodyMiddleware } from "./middlewares/rawBody.middleware";
import { WebhookController } from "./api/webhook.controller";
import { StripeService } from "./services/stripe.service";
import { PaymentService } from "./services/payment.service";
import { PaymentRepository } from "./repositories/payment.repository";
import { WebhookEventRepository } from "./repositories/webhook-event.repository";

const app = express();

const stripeService = new StripeService();
const paymentRepo = new PaymentRepository();
const webhookEventRepo = new WebhookEventRepository();
const paymentService = new PaymentService(paymentRepo, webhookEventRepo);
const webhookController = new WebhookController(stripeService, paymentService);

app.post("/webhook", rawBodyMiddleware, webhookController.handle);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

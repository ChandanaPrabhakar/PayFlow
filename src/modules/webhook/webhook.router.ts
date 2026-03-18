import { Router } from "express";
import { handleWebhook } from "./webhook.controller.ts";

const webhookRouter = Router();

webhookRouter.post("/", handleWebhook);

export default webhookRouter;

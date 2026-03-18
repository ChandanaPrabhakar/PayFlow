import { Router } from "express";
import { createPaymentIntentController } from "../transaction/transaction.controller.ts";

const transactionRouter = Router();

transactionRouter.post("/create-payment-intent", createPaymentIntentController);

export default transactionRouter;

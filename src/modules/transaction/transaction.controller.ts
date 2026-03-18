import type { Request, Response, NextFunction } from "express";
import { TransactionService } from "./transaction.service.ts";

const transactionService = new TransactionService();

export const createPaymentIntentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const paymentIntent = await transactionService.createPaymentIntent(
      req.body,
    );

    res.status(201).json({
      success: true,
      data: paymentIntent,
    });
  } catch (error: any) {
    next(error);
  }
};

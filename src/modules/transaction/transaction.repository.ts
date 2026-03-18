import { prisma } from "../../config/prisma.ts";
import type { Transaction } from "@prisma/client";

export class TransactionRepository {
  async createTransaction(data: {
    id: string;
    userId?: string;
    amount: number;
    currency: string;
    email?: string;
    status: string;
    stripeEventId?: string;
  }): Promise<Transaction> {
    return prisma.transaction.create({
      data: {
        id: data.id,
        amount: data.amount,
        currency: data.currency,
        status: data.status,
        email: data.email,
        stripeEventId: data.stripeEventId ?? null,
        ...(data.userId && {
          user: {
            connect: { id: data.userId },
          },
        }),
      },
    });
  }

  async paymentStatus(
    id: string,
    status: string,
    stripeEventId: string,
  ): Promise<Transaction | null> {
    const tx = await prisma.transaction.findUnique({ where: { id } });

    if (!tx) {
      console.warn("Transaction not found, will retry:", id);
      return null;
    }

    if (tx.status === "SUCCEEDED" && tx.stripeEventId === stripeEventId) {
      return tx;
    }

    return prisma.transaction.update({
      where: { id },
      data: { status, stripeEventId },
    });
  }

  async findById(id: string): Promise<Transaction | null> {
    return prisma.transaction.findUnique({
      where: { id },
    });
  }

  async existsByEventId(eventId: string): Promise<Transaction | null> {
    return prisma.transaction.findUnique({
      where: { stripeEventId: eventId },
    });
  }
}

import { prisma } from "../../config/prisma.ts";

export class ReceiptRepository {
  async createReceipt(data: {
    transactionId: string;
    url: string;
    email: string;
  }) {
    return prisma.receipt.create({
      data: {
        transactionId: data.transactionId,
        url: data.url,
        email: data.email,
      },
    });
  }
}

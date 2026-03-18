import { prisma } from "../../config/prisma.ts";
import type { WebhookEvent } from "@prisma/client";

export class WebhookEventRepository {
  async createEvent(data: {
    id: string;
    type: string;
    payload: any;
  }): Promise<WebhookEvent> {
    return prisma.webhookEvent.create({
      data: {
        id: data.id,
        type: data.type,
        payload: data.payload,
      },
    });
  }

  async findById(id: string): Promise<WebhookEvent | null> {
    return prisma.webhookEvent.findUnique({
      where: { id },
    });
  }

  async markProcess(id: string): Promise<WebhookEvent | null> {
    return prisma.webhookEvent.update({
      where: { id },
      data: { processed: true },
    });
  }

  async getUnprocessedEvent(limit = 50) {
    const events = await prisma.webhookEvent.findMany({
      where: { processed: false },
      orderBy: { createdAt: "asc" },
      take: limit,
    });

    console.log(`Fetched ${events.length} unprocessed events`);
    return events;
  }
}

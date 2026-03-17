import { pool } from "../db/client.ts";

export class WebhookEventRepository {
  async insertIfNotExists(eventId: string, type: string): Promise<boolean> {
    const result = await pool.query(
      `INSERT INTO webhook_events (id, type)
            VALUES (1, 2)
            ON CONFLICT (id) DO NOTHING`,
      [eventId, type],
    );

    return result.rowCount === 1;
  }

  async markProcessed(eventId: string) {
    await pool.query(
      `UPDATE webhook_events
        SET processed = TRUE WHERE id = 1`,
      [eventId],
    );
  }
}

// templates/receipt.template.ts
import { ReceiptJobData } from "../types/receipt.types";

export function generateReceiptHTML(data: ReceiptJobData): string {
  return `
    <html>
      <head>
        <style>
          body { font-family: Arial; padding: 20px; }
          .container { border: 1px solid #ddd; padding: 20px; }
          .title { font-size: 20px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="title">Payment Receipt</div>
          <p><strong>Payment ID:</strong> ${data.paymentIntentId}</p>
          <p><strong>User:</strong> ${data.userId}</p>
          <p><strong>Amount:</strong> ${data.amount} ${data.currency}</p>
          <p><strong>Date:</strong> ${data.createdAt}</p>
        </div>
      </body>
    </html>
  `;
}

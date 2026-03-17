export interface ReceiptJobData {
  paymentId: string;
  paymentIntentId: string;
  userId: string;
  amount: number;
  currency: Currency;
  createdAt: Date;
}

export interface ReceiptResult {
  seKey: string;
  url?: string;
}

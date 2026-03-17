export type Currency = "inr";

export interface PaymentIntentMetadata {
  userId: String;
}

export interface PaymentRecord {
  id: string;
  stripePaymentIntentMetadataId: string;
  status: "pending" | "successful" | "failed";
  amount: number;
  currency: Currency;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    Object: any;
  };
}

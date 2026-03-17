import dotenv from "dotenv";

dotenv.config();

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env ${name}`);
  return value;
}

export const env = {
  STRIPE_SECRET_KEY: requiredEnv("STRIPE_SECRET_KEY"),
  STRIPE_WEBHOOK_SECRET: requiredEnv("STRIPE_WEBHOOK_SECRET"),
  DATABASE_URI: requiredEnv("DATABASE_URI"),
};

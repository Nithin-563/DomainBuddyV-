import Stripe from "stripe"

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error("STRIPE_SECRET_KEY not set")

  return new Stripe(key, {
    apiVersion: "2025-03-31" as any,
    typescript: true,
  })
}

export const PRICE_IDS = {
  starter: {
    monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY ?? "",
    annual: process.env.STRIPE_PRICE_STARTER_ANNUAL ?? "",
  },
  pro: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY ?? "",
    annual: process.env.STRIPE_PRICE_PRO_ANNUAL ?? "",
  },
  enterprise: {
    monthly: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY ?? "",
    annual: process.env.STRIPE_PRICE_ENTERPRISE_ANNUAL ?? "",
  },
} as const

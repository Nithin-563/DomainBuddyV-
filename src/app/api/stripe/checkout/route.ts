import { NextRequest, NextResponse } from "next/server"
import { getStripe, PRICE_IDS } from "@/lib/stripe"
import { auth } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { plan, billing } = await request.json()

  const planKey = plan as keyof typeof PRICE_IDS
  const priceId =
    billing === "annual"
      ? PRICE_IDS[planKey]?.annual
      : PRICE_IDS[planKey]?.monthly

  if (!priceId) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
  }

  const stripe = getStripe()
  const checkout = await stripe.checkout.sessions.create({
    customer_email: session.user.email,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?cancelled=true`,
    metadata: {
      userId: session.user.id ?? session.user.email,
    },
  })

  return NextResponse.json({ url: checkout.url })
}

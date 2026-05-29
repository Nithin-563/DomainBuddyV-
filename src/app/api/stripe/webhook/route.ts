import { NextRequest, NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"
import { supabaseQuery } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature") ?? ""

  const stripe = getStripe()

  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    )
  }

  const subscription = event.data.object as any

  switch (event.type) {
    case "checkout.session.completed": {
      const userId = subscription.metadata?.userId
      if (userId) {
        await supabaseQuery("profiles", "upsert", {
          data: {
            email: userId,
            stripe_customer_id: subscription.customer,
            stripe_subscription_id: subscription.subscription,
            stripe_plan: subscription.metadata?.plan ?? "starter",
            stripe_status: "active",
          },
          onConflict: "email",
        })
      }
      break
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const status =
        subscription.status === "active" ||
        subscription.status === "trialing"
          ? "active"
          : "inactive"

      const customerId = subscription.customer as string

      const profiles = await supabaseQuery("profiles", "select", {
        columns: "email",
        match: { stripe_customer_id: customerId },
      })

      const profile = Array.isArray(profiles) ? profiles[0] : null

      if (profile?.email) {
        await supabaseQuery("profiles", "update", {
          data: {
            stripe_status: status,
            stripe_subscription_id: subscription.id,
          },
          match: { email: profile.email },
        })
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}

import { NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"
import { auth } from "@/lib/auth"
import { supabaseQuery } from "@/lib/supabase"

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const profiles = await supabaseQuery("profiles", "select", {
    columns: "stripe_customer_id",
    match: { email: session.user.email },
  })

  const profile = Array.isArray(profiles) ? profiles[0] : null

  if (!profile?.stripe_customer_id) {
    return NextResponse.json(
      { error: "No subscription found" },
      { status: 404 }
    )
  }

  const stripe = getStripe()
  const portal = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  })

  return NextResponse.json({ url: portal.url })
}

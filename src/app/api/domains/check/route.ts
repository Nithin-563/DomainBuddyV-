import { NextRequest, NextResponse } from "next/server"
import { checkDomain } from "@/lib/domain"
import { checkSearchLimit } from "@/lib/limits"
import { supabaseQuery } from "@/lib/supabase"
import { auth } from "@/lib/auth"
import { valuateDomain } from "@/lib/valuation"

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain")

  if (!domain || !domain.includes(".")) {
    return NextResponse.json(
      { error: "Invalid domain" },
      { status: 400 }
    )
  }

  const session = await auth()
  const email = session?.user?.email
  let remaining: number | undefined

  if (email) {
    const limit = await checkSearchLimit(email)
    remaining = limit.remaining
    if (!limit.allowed) {
      return NextResponse.json(
        {
          error: `Daily limit reached (${limit.plan} plan: 3/day). Upgrade for more.`,
          remaining: 0,
          plan: limit.plan,
        },
        { status: 429 }
      )
    }

    try {
      await supabaseQuery("searches", "upsert", {
        data: {
          email,
          domain: domain.toLowerCase(),
          user_id: session?.user?.id ?? email,
        },
        onConflict: "email,domain",
      })
    } catch {}
  }

  const result = await checkDomain(domain.toLowerCase())
  const valuation = valuateDomain(domain.toLowerCase())

  return NextResponse.json({ ...result, valuation, remaining })
}

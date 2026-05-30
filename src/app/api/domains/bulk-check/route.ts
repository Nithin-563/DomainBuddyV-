import { NextRequest, NextResponse } from "next/server"
import { checkDomain } from "@/lib/domain"
import { auth } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Sign in to use bulk check" },
      { status: 401 }
    )
  }

  const { domains } = await request.json()

  if (
    !Array.isArray(domains) ||
    domains.length === 0 ||
    domains.length > 50
  ) {
    return NextResponse.json(
      { error: "Send 1–50 domains" },
      { status: 400 }
    )
  }

  const results = await Promise.allSettled(
    domains.map((d: string) => checkDomain(d.toLowerCase()))
  )

  const data = results.map((r, i) =>
    r.status === "fulfilled"
      ? r.value
      : { domain: domains[i], available: false, error: true }
  )

  return NextResponse.json({ data })
}

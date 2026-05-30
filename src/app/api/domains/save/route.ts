import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { supabaseQuery } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { domain } = await request.json()
  if (!domain) {
    return NextResponse.json({ error: "Domain required" }, { status: 400 })
  }

  await supabaseQuery("saved_domains", "upsert", {
    data: {
      email: session.user.email,
      user_id: session.user.id ?? session.user.email,
      domain: domain.toLowerCase(),
    },
    onConflict: "email,domain",
  })

  return NextResponse.json({ saved: true })
}

export async function DELETE(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const domain = searchParams.get("domain")

  if (!domain) {
    return NextResponse.json({ error: "Domain required" }, { status: 400 })
  }

  await supabaseQuery("saved_domains", "update", {
    data: { deleted: true },
    match: { email: session.user.email, domain: domain.toLowerCase() },
  })

  return NextResponse.json({ deleted: true })
}

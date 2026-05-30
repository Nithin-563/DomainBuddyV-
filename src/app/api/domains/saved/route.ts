import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { supabaseQuery } from "@/lib/supabase"

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const saved = await supabaseQuery("saved_domains", "select", {
    columns: "domain,created_at",
    match: { email: session.user.email },
  })

  return NextResponse.json({
    saved: Array.isArray(saved) ? saved : [],
  })
}

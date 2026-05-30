import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { supabaseQuery } from "@/lib/supabase"

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const searches = await supabaseQuery("searches", "select", {
    columns: "domain,available,created_at",
    match: { email: session.user.email },
  })

  return NextResponse.json({
    searches: Array.isArray(searches) ? searches.slice(-20).reverse() : [],
  })
}

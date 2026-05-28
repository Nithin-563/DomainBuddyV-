import { NextRequest, NextResponse } from "next/server"
import { checkDomain } from "@/lib/domain"

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain")

  if (!domain || !domain.includes(".")) {
    return NextResponse.json(
      { error: "Invalid domain" },
      { status: 400 }
    )
  }

  const result = await checkDomain(domain.toLowerCase())
  return NextResponse.json(result)
}

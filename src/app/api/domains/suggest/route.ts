import { NextRequest, NextResponse } from "next/server"
import { generateSuggestions } from "@/lib/domain"

export async function GET(request: NextRequest) {
  const keyword = request.nextUrl.searchParams.get("keyword")

  if (!keyword || keyword.length < 2) {
    return NextResponse.json(
      { error: "Keyword must be at least 2 characters" },
      { status: 400 }
    )
  }

  const suggestions = generateSuggestions(keyword)
  return NextResponse.json({ keyword, suggestions })
}

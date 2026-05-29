const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""

const headers = {
  "Content-Type": "application/json",
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
}

export async function supabaseQuery(
  table: string,
  action: "select" | "upsert" | "update",
  options: {
    columns?: string
    data?: Record<string, unknown>
    match?: Record<string, string>
    onConflict?: string
  } = {}
) {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    throw new Error("Supabase env vars not configured")
  }

  const base = `${SUPABASE_URL}/rest/v1/${table}`

  if (action === "select" && options.match) {
    const params = new URLSearchParams()
    params.set("select", options.columns ?? "*")
    Object.entries(options.match).forEach(([k, v]) => {
      params.set(`${k}`, `eq.${v}`)
    })
    const res = await fetch(`${base}?${params}`, { headers })
    return res.json()
  }

  if (action === "upsert") {
    const params = new URLSearchParams()
    if (options.onConflict) params.set("on_conflict", options.onConflict)
    const res = await fetch(`${base}?${params}`, {
      method: "POST",
      headers: { ...headers, Prefer: "resolution=merge-duplicates" },
      body: JSON.stringify(options.data ? [options.data] : []),
    })
    return res.json()
  }

  if (action === "update" && options.match) {
    const params = new URLSearchParams()
    Object.entries(options.match).forEach(([k, v]) => {
      params.set(`${k}`, `eq.${v}`)
    })
    const res = await fetch(`${base}?${params}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(options.data ?? {}),
    })
    return res.json()
  }
}

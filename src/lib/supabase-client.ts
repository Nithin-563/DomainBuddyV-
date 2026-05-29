const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""

export function getBrowserSupabase() {
  const headers = {
    "Content-Type": "application/json",
    apikey: ANON_KEY,
    Authorization: `Bearer ${ANON_KEY}`,
  }

  return {
    from: (table: string) => ({
      select: async (columns = "*") => {
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/${table}?select=${columns}`,
          { headers }
        )
        return { data: await res.json(), error: null }
      },
      insert: async (data: Record<string, unknown>) => {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
          method: "POST",
          headers: { ...headers, Prefer: "return=representation" },
          body: JSON.stringify(data),
        })
        return { data: await res.json(), error: null }
      },
    }),
  }
}

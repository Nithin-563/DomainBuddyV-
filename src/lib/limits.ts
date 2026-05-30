import { supabaseQuery } from "./supabase"

export const SEARCH_LIMITS: Record<string, number> = {
  free: 3,
  starter: 50,
  pro: -1,
  enterprise: -1,
}

export const SAVED_LIMITS: Record<string, number> = {
  free: 0,
  starter: 20,
  pro: -1,
  enterprise: -1,
}

export const BULK_LIMITS: Record<string, number> = {
  free: 0,
  starter: 5,
  pro: 50,
  enterprise: 100,
}

export async function getUserPlan(
  email: string
): Promise<{ plan: string; status: string }> {
  try {
    const profiles = await supabaseQuery("profiles", "select", {
      columns: "stripe_plan,stripe_status",
      match: { email },
    })
    const profile = Array.isArray(profiles) ? profiles[0] : null
    if (profile?.stripe_status === "active") {
      return { plan: profile.stripe_plan ?? "free", status: "active" }
    }
  } catch {}
  return { plan: "free", status: "inactive" }
}

export async function getDailySearchCount(
  email: string
): Promise<number> {
  try {
    const today = new Date().toISOString().split("T")[0]
    const searches = await supabaseQuery("searches", "select", {
      columns: "id",
      match: { email },
    })
    const list = Array.isArray(searches) ? searches : []
    return list.filter((s: any) =>
      s.created_at?.startsWith(today)
    ).length
  } catch {
    return 0
  }
}

export async function checkSearchLimit(
  email: string
): Promise<{ allowed: boolean; remaining: number; plan: string }> {
  const { plan } = await getUserPlan(email)
  const limit = SEARCH_LIMITS[plan] ?? 3

  if (limit === -1) {
    return { allowed: true, remaining: 999, plan }
  }

  const count = await getDailySearchCount(email)
  const remaining = Math.max(0, limit - count)

  return { allowed: remaining > 0, remaining, plan }
}

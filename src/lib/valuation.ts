const PREMIUM_TLDS: Record<string, number> = {
  com: 10,
  io: 8,
  ai: 9,
  app: 7,
  dev: 7,
  net: 5,
  org: 6,
  co: 4,
}

function scoreDomain(domain: string): number {
  const name = domain.split(".")[0]
  const tld = domain.split(".").pop() ?? "com"
  let score = 50

  const tldScore = PREMIUM_TLDS[tld] ?? 2
  score += tldScore * 3

  if (name.length <= 4) score += 25
  else if (name.length <= 6) score += 15
  else if (name.length <= 8) score += 5
  else score -= 10

  if (/^[a-z]+$/.test(name)) score += 15
  else if (/^[a-z0-9]+$/.test(name)) score += 5
  else score -= 15

  if (/[aeiou]/i.test(name)) score += 5
  if (name.endsWith("ify") || name.endsWith("ly") || name.endsWith("io")) score += 10
  if (/^(get|try|use|go|my)/.test(name)) score += 5

  return Math.max(0, Math.min(100, score))
}

export function valuateDomain(domain: string): {
  score: number
  label: string
  range: string
  color: string
} {
  const s = scoreDomain(domain)

  if (s >= 80)
    return { score: s, label: "Premium", range: "₹10,000+", color: "text-emerald-400" }
  if (s >= 60)
    return { score: s, label: "Great", range: "₹1,000–10,000", color: "text-emerald-400" }
  if (s >= 40)
    return { score: s, label: "Good", range: "₹500–1,000", color: "text-yellow-400" }
  return { score: s, label: "Average", range: "₹100–500", color: "text-zinc-400" }
}

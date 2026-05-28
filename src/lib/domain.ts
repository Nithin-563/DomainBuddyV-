export interface DomainResult {
  domain: string
  available: boolean
  tld: string
  price?: number
  registerUrl?: string
}

const TLD_PRICES: Record<string, number> = {
  com: 12.99,
  net: 14.99,
  org: 13.99,
  io: 38.99,
  ai: 89.99,
  dev: 14.99,
  app: 14.99,
  me: 24.99,
  co: 29.99,
  shop: 19.99,
  online: 19.99,
  tech: 19.99,
  store: 29.99,
  blog: 29.99,
  xyz: 9.99,
  info: 10.99,
  live: 19.99,
}

export function getDomainPrice(domain: string): number {
  const tld = domain.split(".").pop()?.toLowerCase() ?? "com"
  return TLD_PRICES[tld] ?? 14.99
}

export async function checkDomain(
  domain: string
): Promise<DomainResult> {
  const tld = domain.split(".").pop()?.toLowerCase() ?? "com"
  const price = getDomainPrice(domain)

  try {
    const rdapUrl = `https://rdap.verisign.com/com/v1/domain/${domain}`
    const response = await fetch(rdapUrl, {
      signal: AbortSignal.timeout(5000),
    })

    const available = response.status === 404

    return {
      domain,
      available,
      tld,
      price,
      registerUrl: available
        ? generateAffiliateUrl(domain)
        : undefined,
    }
  } catch {
    return {
      domain,
      available: false,
      tld,
      price,
    }
  }
}

export function generateAffiliateUrl(domain: string): string {
  const affiliateId =
    process.env.NEXT_PUBLIC_NAMECHEAP_AFFILIATE_ID ?? ""
  const encoded = encodeURIComponent(domain)
  return `https://www.namecheap.com/domains/registration/results/?domain=${encoded}&aff=${affiliateId}`
}

const WORDS = [
  "app", "hub", "lab", "box", "zone", "flow", "nest", "peak",
  "cove", "node", "base", "core", "edge", "grid", "link", "loop",
  "mind", "palm", "path", "peak", "pix", "pod", "pro", "pulse",
  "rise", "roam", "scale", "seed", "set", "side", "sky", "snap",
  "span", "spark", "spin", "spot", "star", "sync", "tap", "tip",
  "trace", "trip", "unit", "vibe", "view", "void", "volt", "wave",
]

const PREFIXES = [
  "get", "try", "use", "go", "my", "hey", "hi", "join", "find",
]

export function generateSuggestions(keyword: string): string[] {
  const clean = keyword.toLowerCase().replace(/[^a-z0-9]/g, "")
  if (!clean) return []

  const suggestions = new Set<string>()

  const tlDs = ["com", "net", "org", "io", "dev", "app", "co"]

  suggestions.add(`${clean}.com`)

  for (const tld of tlDs.slice(0, 4)) {
    suggestions.add(`${clean}.${tld}`)
  }

  for (const word of WORDS.slice(0, 6)) {
    suggestions.add(`${clean}${word}.com`)
    suggestions.add(`${word}${clean}.com`)
  }

  for (const prefix of PREFIXES) {
    suggestions.add(`${prefix}${clean}.com`)
  }

  return Array.from(suggestions).slice(0, 12)
}

export function namecheapLink(domain: string): string {
  const id = process.env.NEXT_PUBLIC_NAMECHEAP_AFFILIATE_ID ?? ""
  return `https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(domain)}&aff=${id}`
}

export function godaddyLink(domain: string): string {
  const id = process.env.NEXT_PUBLIC_GODADDY_AFFILIATE_ID ?? ""
  return `https://www.godaddy.com/domainsearch/find?domainToCheck=${encodeURIComponent(domain)}&aff=${id}`
}

export function hostingLink(provider: string): string {
  const links: Record<string, string> = {
    namecheap: "https://www.namecheap.com/hosting/",
    hostinger: "https://www.hostinger.com/",
    vercel: "https://vercel.com/",
  }
  return links[provider] ?? links.namecheap
}

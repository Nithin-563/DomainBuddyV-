"use client"

import { useState } from "react"
import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  Check,
  Sparkles,
  Loader2,
  ArrowRight,
} from "lucide-react"

type Billing = "monthly" | "annual"

interface Plan {
  name: string
  slug: string
  monthlyPrice: number
  annualPrice: number
  description: string
  highlighted?: boolean
  features: string[]
  cta: string
}

const plans: Plan[] = [
  {
    name: "Free",
    slug: "free",
    monthlyPrice: 0,
    annualPrice: 0,
    description: "Get started with basic domain search.",
    features: [
      "3 searches per day",
      "5 AI suggestions per search",
      "Basic availability check",
      "Affiliate purchase links",
    ],
    cta: "Get Started",
  },
  {
    name: "Starter",
    slug: "starter",
    monthlyPrice: 9,
    annualPrice: 90,
    description: "For solo founders and side projects.",
    features: [
      "50 searches per day",
      "Unlimited AI suggestions",
      "Save up to 20 domains",
      "Bulk check (5 at a time)",
      "7-day search history",
    ],
    cta: "Subscribe",
  },
  {
    name: "Pro",
    slug: "pro",
    monthlyPrice: 19,
    annualPrice: 190,
    description: "For serious domain investors.",
    highlighted: true,
    features: [
      "Unlimited searches",
      "Unlimited AI suggestions",
      "Unlimited saved domains",
      "Bulk check (50 at a time)",
      "Domain valuation",
      "WHOIS lookup",
      "1-year search history",
      "Priority support",
    ],
    cta: "Subscribe",
  },
  {
    name: "Enterprise",
    slug: "enterprise",
    monthlyPrice: 49,
    annualPrice: 490,
    description: "For agencies and teams.",
    features: [
      "Everything in Pro",
      "API access (1,000 req/day)",
      "CSV export",
      "Team accounts (up to 5)",
      "White-label suggestions",
      "Dedicated support",
    ],
    cta: "Subscribe",
  },
]

export default function PricingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [billing, setBilling] = useState<Billing>("monthly")
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (plan: Plan) => {
    if (plan.slug === "free") {
      router.push(session ? "/dashboard" : "/auth/signin")
      return
    }

    if (!session) {
      signIn("google", { callbackUrl: "/pricing" })
      return
    }

    setLoading(plan.slug)

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: plan.slug, billing }),
      })

      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      }
    } finally {
      setLoading(null)
    }
  }

  return (
    <main className="flex flex-1 flex-col">
      <section className="relative px-4 pb-24 pt-16 text-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-500/5 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs text-emerald-300">
            <Sparkles className="h-3.5 w-3.5" />
            Simple Pricing
          </div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Find the perfect{" "}
            <span className="gradient-text">plan for you</span>
          </h1>

          <p className="mx-auto mb-8 max-w-lg text-zinc-500">
            Start free, upgrade when you need more. All plans include
            affiliate purchase links.
          </p>

          <div className="mb-10 inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
            <button
              onClick={() => setBilling("monthly")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                billing === "monthly"
                  ? "bg-emerald-500 text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("annual")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                billing === "annual"
                  ? "bg-emerald-500 text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Annual{" "}
              <span className="ml-1 text-xs opacity-70">Save 17%</span>
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-4">
            {plans.map((plan) => (
              <div
                key={plan.slug}
                className={`relative rounded-2xl p-6 text-left transition duration-300 ${
                  plan.highlighted
                    ? "glass ring-1 ring-emerald-500/30"
                    : "glass glass-hover"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 px-3 py-0.5 text-xs font-medium text-black">
                      Best Value
                    </span>
                  </div>
                )}

                <h3 className="text-lg font-semibold text-white">
                  {plan.name}
                </h3>
                <p className="mb-4 mt-1 text-xs text-zinc-500">
                  {plan.description}
                </p>

                <div className="mb-5">
                  <span className="text-4xl font-bold text-white">
                    $
                    {billing === "monthly"
                      ? plan.monthlyPrice
                      : plan.annualPrice}
                  </span>
                  <span className="ml-1 text-sm text-zinc-500">
                    /{billing === "monthly" ? "mo" : "yr"}
                  </span>
                  {billing === "annual" && plan.monthlyPrice > 0 && (
                    <p className="mt-1 text-xs text-emerald-400">
                      ${plan.monthlyPrice}/mo billed annually
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={loading === plan.slug}
                  className={`group relative w-full overflow-hidden rounded-xl py-2.5 text-sm font-medium transition ${
                    plan.highlighted
                      ? "text-black"
                      : "border border-white/10 text-zinc-300 hover:bg-white/5"
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 transition group-hover:from-emerald-300 group-hover:to-teal-300" />
                  )}
                  <span className="relative flex items-center justify-center gap-1.5">
                    {loading === plan.slug ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        {plan.cta}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </span>
                </button>

                <ul className="mt-6 space-y-2.5">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-zinc-400"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

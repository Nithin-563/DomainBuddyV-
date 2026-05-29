"use client"

import {
  Globe,
  Search,
  Heart,
  Star,
  TrendingUp,
  Clock,
} from "lucide-react"

const stats = [
  {
    icon: Search,
    label: "Searches",
    value: "12",
    change: "+3 this week",
  },
  {
    icon: Heart,
    label: "Saved",
    value: "5",
    change: "2 available",
  },
  {
    icon: Star,
    label: "Plan",
    value: "Free",
    change: "Upgrade for more",
  },
]

const recentSearches = [
  { domain: "myapp.io", status: "available", price: "$38.99/yr" },
  { domain: "startuplab.com", status: "taken", price: null },
  { domain: "devhub.dev", status: "available", price: "$14.99/yr" },
  { domain: "saasbox.com", status: "available", price: "$12.99/yr" },
]

export default function DashboardContent({
  user,
}: {
  user: { name?: string | null; email?: string | null; id?: string }
}) {
  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Welcome back
          {user?.name ? (
            <span className="gradient-text">, {user.name}</span>
          ) : (
            ""
          )}
        </h1>
        <p className="mt-1 text-zinc-500">
          Track your domains and searches
        </p>
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="glass group rounded-2xl p-5 transition duration-300"
          >
            <div className="mb-3 flex items-center gap-2">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/5 ring-1 ring-emerald-500/10">
                <s.icon className="h-4 w-4 text-emerald-400" />
              </div>
              <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                {s.label}
              </span>
            </div>
            <p className="text-3xl font-bold text-white">{s.value}</p>
            <p className="mt-1 text-xs text-zinc-600">{s.change}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 flex items-center gap-2">
        <Clock className="h-4 w-4 text-emerald-400" />
        <h2 className="text-lg font-semibold text-white">
          Recent Searches
        </h2>
      </div>

      <div className="space-y-2">
        {recentSearches.map((s) => (
          <div
            key={s.domain}
            className="glass glass-hover flex items-center justify-between rounded-xl p-4 transition"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
                <Globe className="h-4 w-4 text-zinc-500" />
              </div>
              <span className="font-mono text-sm text-white">
                {s.domain}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {s.price && (
                <span className="text-sm text-zinc-500">{s.price}</span>
              )}
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  s.status === "available"
                    ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
                    : "bg-red-500/10 text-red-400 ring-1 ring-red-500/20"
                }`}
              >
                {s.status === "available" ? "Available" : "Taken"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

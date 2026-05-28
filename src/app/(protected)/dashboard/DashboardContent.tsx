"use client"

import { Globe, Search, Heart, Star } from "lucide-react"

export default function DashboardContent({
  user,
}: {
  user: { name?: string | null; email?: string | null; id?: string }
}) {
  const recentSearches = [
    { domain: "myapp.io", status: "available", price: "$38.99/yr" },
    { domain: "startuplab.com", status: "taken", price: null },
    { domain: "devhub.dev", status: "available", price: "$14.99/yr" },
  ]

  return (
    <div className="mx-auto max-w-5xl flex-1 px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Welcome, {user?.name ?? "Domainer"} 👋
        </h1>
        <p className="mt-1 text-zinc-400">
          Track your domains and searches
        </p>
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="mb-2 flex items-center gap-2 text-emerald-400">
            <Search className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">
              Searches
            </span>
          </div>
          <p className="text-2xl font-bold text-white">12</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="mb-2 flex items-center gap-2 text-emerald-400">
            <Heart className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">
              Saved
            </span>
          </div>
          <p className="text-2xl font-bold text-white">5</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="mb-2 flex items-center gap-2 text-emerald-400">
            <Star className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">
              Premium
            </span>
          </div>
          <p className="text-2xl font-bold text-white">Free</p>
        </div>
      </div>

      <h2 className="mb-4 text-lg font-semibold text-white">
        Recent Searches
      </h2>
      <div className="space-y-2">
        {recentSearches.map((s) => (
          <div
            key={s.domain}
            className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-3"
          >
            <div className="flex items-center gap-3">
              <Globe className="h-4 w-4 text-zinc-500" />
              <span className="font-mono text-sm text-white">
                {s.domain}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {s.price && (
                <span className="text-xs text-zinc-500">{s.price}</span>
              )}
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  s.status === "available"
                    ? "bg-emerald-900/50 text-emerald-400"
                    : "bg-red-900/50 text-red-400"
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

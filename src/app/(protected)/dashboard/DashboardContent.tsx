"use client"

import { useState, useEffect } from "react"
import {
  Globe,
  Search,
  Heart,
  Star,
  Clock,
  Trash2,
  ExternalLink,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

interface SearchItem {
  domain: string
  created_at: string
}

interface SavedItem {
  domain: string
  created_at: string
}

export default function DashboardContent({
  user,
}: {
  user: { name?: string | null; email?: string | null; id?: string }
}) {
  const [searches, setSearches] = useState<SearchItem[]>([])
  const [saved, setSaved] = useState<SavedItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/domains/history").then((r) => r.json()),
      fetch("/api/domains/saved").then((r) => r.json()),
    ]).then(([h, s]) => {
      setSearches(h.searches ?? [])
      setSaved(s.saved ?? [])
      setLoading(false)
    })
  }, [])

  const removeSaved = async (domain: string) => {
    await fetch(`/api/domains/save?domain=${encodeURIComponent(domain)}`, {
      method: "DELETE",
    })
    setSaved((prev) => prev.filter((s) => s.domain !== domain))
  }

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
        <div className="glass group rounded-2xl p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/5 ring-1 ring-emerald-500/10">
              <Search className="h-4 w-4 text-emerald-400" />
            </div>
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Searches
            </span>
          </div>
          <p className="text-3xl font-bold text-white">
            {loading ? "..." : searches.length}
          </p>
          <p className="mt-1 text-xs text-zinc-600">All time</p>
        </div>

        <div className="glass group rounded-2xl p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/5 ring-1 ring-emerald-500/10">
              <Heart className="h-4 w-4 text-emerald-400" />
            </div>
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Saved
            </span>
          </div>
          <p className="text-3xl font-bold text-white">
            {loading ? "..." : saved.length}
          </p>
          <p className="mt-1 text-xs text-zinc-600">
            {saved.length > 0 ? "Click heart to remove" : "Save domains from search"}
          </p>
        </div>

        <Link href="/pricing" className="glass group rounded-2xl p-5 transition hover:bg-white/[0.04]">
          <div className="mb-3 flex items-center gap-2">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/5 ring-1 ring-emerald-500/10">
              <Star className="h-4 w-4 text-emerald-400" />
            </div>
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Plan
            </span>
          </div>
          <p className="text-3xl font-bold text-white">Free</p>
          <p className="mt-1 text-xs text-emerald-400 transition group-hover:text-emerald-300">
            Upgrade for more &rarr;
          </p>
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-400" />
            <h2 className="text-lg font-semibold text-white">
              Recent Searches
            </h2>
          </div>

          {loading ? (
            <div className="text-sm text-zinc-500">Loading...</div>
          ) : searches.length === 0 ? (
            <div className="rounded-xl border border-white/5 px-4 py-8 text-center text-sm text-zinc-600">
              No searches yet.{" "}
              <Link href="/" className="text-emerald-400 hover:underline">
                Search for a domain
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {searches.slice(0, 10).map((s) => (
                <div
                  key={s.domain + s.created_at}
                  className="glass flex items-center justify-between rounded-xl px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-zinc-500" />
                    <span className="font-mono text-sm text-white">
                      {s.domain}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-600">
                    {new Date(s.created_at).toLocaleDateString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="mb-4 flex items-center gap-2">
            <Heart className="h-4 w-4 text-emerald-400" />
            <h2 className="text-lg font-semibold text-white">
              Saved Domains
            </h2>
          </div>

          {loading ? (
            <div className="text-sm text-zinc-500">Loading...</div>
          ) : saved.length === 0 ? (
            <div className="rounded-xl border border-white/5 px-4 py-8 text-center text-sm text-zinc-600">
              No saved domains.{" "}
              <Link href="/" className="text-emerald-400 hover:underline">
                Search and save
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {saved.map((s) => (
                <div
                  key={s.domain}
                  className="glass flex items-center justify-between rounded-xl px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <Heart className="h-4 w-4 text-red-400" />
                    <span className="font-mono text-sm text-white">
                      {s.domain}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://www.namecheap.com/domains/registration/results/?domain=${s.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-white/5 hover:text-emerald-400"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => removeSaved(s.domain)}
                      className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

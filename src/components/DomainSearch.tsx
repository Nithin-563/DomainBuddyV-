"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Sparkles,
  ExternalLink,
  Loader2,
  Globe,
  Heart,
  Layers,
  TrendingUp,
} from "lucide-react"
import { useSession } from "next-auth/react"

interface DomainResult {
  domain: string
  available: boolean
  tld: string
  price?: number
  registerUrl?: string
  valuation?: {
    score: number
    label: string
    range: string
    color: string
  }
  remaining?: number
}

export default function DomainSearch() {
  const { data: session } = useSession()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<DomainResult[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<"search" | "suggest" | "bulk">("search")
  const [bulkInput, setBulkInput] = useState("")
  const [error, setError] = useState("")
  const [saved, setSaved] = useState<Set<string>>(new Set())
  const [remaining, setRemaining] = useState<number | null>(null)
  const [anonCount, setAnonCount] = useState(0)

  useEffect(() => {
    const stored = localStorage.getItem("domainbuddy-anon-count")
    if (stored) setAnonCount(parseInt(stored, 10))
  }, [])

  const handleSearch = async () => {
    const domain = query.trim().toLowerCase()
    if (!domain || !domain.includes(".")) return

    if (!session && anonCount >= 3) {
      setError("Free limit reached. Sign in for more searches.")
      return
    }

    setLoading(true)
    setSuggestions([])
    setError("")
    setMode("search")

    try {
      const res = await fetch(
        `/api/domains/check?domain=${encodeURIComponent(domain)}`
      )
      if (res.status === 429) {
        const data = await res.json()
        setError(data.error ?? "Daily limit reached")
        return
      }
      const data = await res.json()
      setResults([data])
      setRemaining(data.remaining ?? null)
      if (!session) {
        const n = anonCount + 1
        setAnonCount(n)
        localStorage.setItem("domainbuddy-anon-count", String(n))
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSuggest = async () => {
    const keyword = query.trim().toLowerCase()
    if (!keyword || keyword.length < 2) return

    setLoading(true)
    setResults([])
    setError("")
    setMode("suggest")

    try {
      const res = await fetch(
        `/api/domains/suggest?keyword=${encodeURIComponent(keyword)}`
      )
      const data = await res.json()
      setSuggestions(data.suggestions ?? [])
    } finally {
      setLoading(false)
    }
  }

  const handleBulkCheck = async () => {
    const domains = bulkInput
      .split("\n")
      .map((d) => d.trim().toLowerCase())
      .filter((d) => d.includes("."))

    if (domains.length === 0) return
    if (domains.length > 50) {
      setError("Max 50 domains at a time")
      return
    }

    setLoading(true)
    setError("")
    setMode("bulk")

    try {
      const res = await fetch("/api/domains/bulk-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domains }),
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
        return
      }
      setResults(data.data ?? [])
    } finally {
      setLoading(false)
    }
  }

  const checkSuggestion = async (domain: string) => {
    setQuery(domain)
    setMode("search")
    setLoading(true)
    setSuggestions([])

    try {
      const res = await fetch(
        `/api/domains/check?domain=${encodeURIComponent(domain)}`
      )
      const data = await res.json()
      setResults([data])
    } finally {
      setLoading(false)
    }
  }

  const toggleSave = async (domain: string) => {
    if (!session) return
    const isSaved = saved.has(domain)
    try {
      if (isSaved) {
        await fetch(`/api/domains/save?domain=${encodeURIComponent(domain)}`, {
          method: "DELETE",
        })
        setSaved((prev) => {
          const next = new Set(prev)
          next.delete(domain)
          return next
        })
      } else {
        await fetch("/api/domains/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ domain }),
        })
        setSaved((prev) => new Set(prev).add(domain))
      }
    } catch {}
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (query.includes(".") && query.split(".").pop()!.length >= 2) {
        handleSearch()
      } else {
        handleSuggest()
      }
    }
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="flex gap-2">
        <button
          onClick={() => setMode("search")}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            mode === "search"
              ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Search className="mr-1 inline h-3 w-3" />
          Search
        </button>
        <button
          onClick={() => setMode("bulk")}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            mode === "bulk"
              ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Layers className="mr-1 inline h-3 w-3" />
          Bulk
        </button>
      </div>

      <div className="mt-3 group relative">
        <div className="animate-glow absolute -inset-0.5 rounded-xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 opacity-0 blur transition duration-500 group-focus-within:opacity-100" />
        <div className="relative flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm transition group-focus-within:border-emerald-500/40">
          <Search className="h-5 w-5 text-zinc-500 transition group-focus-within:text-emerald-400" />
          {mode === "bulk" ? (
            <textarea
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              placeholder="one.com&#10;two.net&#10;three.io"
              rows={3}
              className="flex-1 bg-transparent text-white placeholder-zinc-600 outline-none resize-none"
            />
          ) : (
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                mode === "suggest"
                  ? "Type a keyword for AI domain ideas..."
                  : "Search for a domain (e.g. mybusiness.com)"
              }
              className="flex-1 bg-transparent text-white placeholder-zinc-600 outline-none"
            />
          )}
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
          ) : mode === "bulk" ? (
            <button
              onClick={handleBulkCheck}
              disabled={!bulkInput.trim()}
              className="group relative overflow-hidden rounded-lg px-4 py-1 text-sm font-medium text-black transition disabled:opacity-30"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400" />
              <span className="relative">Check All</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleSuggest}
                disabled={query.trim().length < 2}
                className="flex items-center gap-1 rounded-lg px-3 py-1 text-sm text-emerald-400 transition hover:bg-emerald-500/10 disabled:opacity-30"
              >
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Suggest</span>
              </button>
              {query.includes(".") && (
                <button
                  onClick={handleSearch}
                  className="group relative overflow-hidden rounded-lg px-4 py-1 text-sm font-medium text-black transition"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 transition group-hover:from-emerald-300 group-hover:to-teal-300" />
                  <span className="relative">Check</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400 ring-1 ring-red-500/20">
          {error}
        </div>
      )}

      {remaining !== null && remaining < 10 && (
        <div className="mt-3 rounded-lg bg-yellow-500/10 px-4 py-2 text-xs text-yellow-400 ring-1 ring-yellow-500/20">
          {remaining} search{remaining !== 1 ? "es" : ""} remaining today
        </div>
      )}

      {!session && anonCount > 0 && anonCount < 3 && (
        <div className="mt-3 text-xs text-zinc-600">
          {3 - anonCount} free search{3 - anonCount !== 1 ? "es" : ""} left
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-6 space-y-3">
          {results.map((r) => (
            <div
              key={r.domain}
              className="group animate-float glass glass-hover rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/5 ring-1 ring-emerald-500/10">
                    <Globe className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-mono text-lg font-medium text-white">
                      {r.domain}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      {r.available ? (
                        <span className="text-emerald-400">Available</span>
                      ) : (
                        <span className="text-red-400">Registered</span>
                      )}
                      {r.price && (
                        <span className="text-zinc-500">
                          — ₹{Math.round(r.price * 83)}/yr
                        </span>
                      )}
                      {r.valuation && (
                        <span
                          className={`${r.valuation.color} text-xs`}
                        >
                          {r.valuation.label} ({r.valuation.range})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {session && (
                    <button
                      onClick={() => toggleSave(r.domain)}
                      className={`rounded-lg p-2 transition ${
                        saved.has(r.domain)
                          ? "text-red-400 hover:bg-red-500/10"
                          : "text-zinc-500 hover:bg-white/5"
                      }`}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          saved.has(r.domain) ? "fill-red-400" : ""
                        }`}
                      />
                    </button>
                  )}
                  {r.available && r.registerUrl && (
                    <a
                      href={r.registerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative overflow-hidden rounded-lg px-4 py-2 text-sm font-medium text-black transition"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 transition group-hover:from-emerald-300 group-hover:to-teal-300" />
                      <span className="relative flex items-center gap-1.5">
                        Get it
                        <ExternalLink className="h-3.5 w-3.5" />
                      </span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="mt-6">
          <p className="mb-4 flex items-center gap-1.5 text-sm text-zinc-400">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            AI-suggested domains for &ldquo;{query}&rdquo;
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {suggestions.map((d, i) => (
              <button
                key={d}
                onClick={() => checkSuggestion(d)}
                className="group glass glass-hover flex items-center justify-between rounded-xl p-3 text-left transition"
              >
                <span className="font-mono text-sm text-zinc-300 transition group-hover:text-white">
                  {d}
                </span>
                <Search className="h-4 w-4 text-zinc-600 transition group-hover:text-emerald-400" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

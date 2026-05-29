"use client"

import { useState } from "react"
import {
  Search,
  Sparkles,
  ExternalLink,
  Loader2,
  Globe,
} from "lucide-react"

interface DomainResult {
  domain: string
  available: boolean
  tld: string
  price?: number
  registerUrl?: string
}

export default function DomainSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<DomainResult[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<"search" | "suggest">("search")

  const handleSearch = async () => {
    const domain = query.trim().toLowerCase()
    if (!domain || !domain.includes(".")) return

    setLoading(true)
    setSuggestions([])
    setMode("search")

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

  const handleSuggest = async () => {
    const keyword = query.trim().toLowerCase()
    if (!keyword || keyword.length < 2) return

    setLoading(true)
    setResults([])
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
      <div className="group relative">
        <div className="animate-glow absolute -inset-0.5 rounded-xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 opacity-0 blur transition duration-500 group-focus-within:opacity-100" />
        <div className="relative flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm transition group-focus-within:border-emerald-500/40">
          <Search className="h-5 w-5 text-zinc-500 transition group-focus-within:text-emerald-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for a domain (e.g. mybusiness.com) or type a keyword..."
            className="flex-1 bg-transparent text-white placeholder-zinc-600 outline-none"
          />
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
          ) : (
            <>
              <button
                onClick={handleSuggest}
                disabled={query.trim().length < 2}
                className="flex items-center gap-1 rounded-lg px-3 py-1 text-sm text-emerald-400 transition hover:bg-emerald-500/10 disabled:opacity-30"
                title="Get AI suggestions"
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

      {results.length > 0 && (
        <div className="mt-6 space-y-3">
          {results.map((r) => (
            <div
              key={r.domain}
              className="group animate-float glass glass-hover rounded-xl p-4"
              style={{ animationDelay: "0.1s" }}
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
                    <p className="text-sm text-zinc-500">
                      {r.available ? (
                        <span className="text-emerald-400">Available</span>
                      ) : (
                        <span className="text-red-400">Registered</span>
                      )}
                      {r.price && ` \u2014 $${r.price}/yr`}
                    </p>
                  </div>
                </div>
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
                style={{ animationDelay: `${i * 0.05}s` }}
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

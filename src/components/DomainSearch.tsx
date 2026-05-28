"use client"

import { useState } from "react"
import { Search, Sparkles, ExternalLink, Loader2, AlertCircle } from "lucide-react"

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

    try {
      const res = await fetch(`/api/domains/check?domain=${encodeURIComponent(domain)}`)
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
      const res = await fetch(`/api/domains/suggest?keyword=${encodeURIComponent(keyword)}`)
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
      const res = await fetch(`/api/domains/check?domain=${encodeURIComponent(domain)}`)
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
      <div className="relative">
        <div className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
          <Search className="h-5 w-5 text-zinc-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for a domain (e.g. mybusiness.com) or type a keyword..."
            className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none"
          />
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
          ) : (
            <>
              <button
                onClick={handleSuggest}
                disabled={query.trim().length < 2}
                className="flex items-center gap-1 rounded-lg px-3 py-1 text-sm text-emerald-400 transition hover:bg-zinc-800 disabled:opacity-40"
                title="Get AI suggestions"
              >
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Suggest</span>
              </button>
              {query.includes(".") && (
                <button
                  onClick={handleSearch}
                  className="rounded-lg bg-emerald-500 px-4 py-1 text-sm font-medium text-black transition hover:bg-emerald-400"
                >
                  Check
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
              className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-4"
            >
              <div>
                <p className="text-lg font-medium text-white">{r.domain}</p>
                <p className="text-sm text-zinc-400">
                  {r.available ? (
                    <span className="text-emerald-400">Available</span>
                  ) : (
                    <span className="text-red-400">Registered</span>
                  )}
                  {r.price && ` — $${r.price}/yr`}
                </p>
              </div>
              {r.available && r.registerUrl && (
                <a
                  href={r.registerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-emerald-400"
                >
                  Get it
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="mt-6">
          <p className="mb-3 text-sm text-zinc-400">
            <Sparkles className="mr-1 inline h-4 w-4 text-emerald-400" />
            AI-suggested domains for &ldquo;{query}&rdquo;
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {suggestions.map((d) => (
              <button
                key={d}
                onClick={() => checkSuggestion(d)}
                className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-left transition hover:border-zinc-700 hover:bg-zinc-800"
              >
                <span className="font-mono text-sm text-white">{d}</span>
                <Search className="h-4 w-4 text-zinc-500" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

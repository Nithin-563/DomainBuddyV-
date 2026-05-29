"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useState } from "react"
import { Globe, Menu, X, LogOut, LayoutDashboard, Sparkles } from "lucide-react"

export default function Navbar() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20 transition group-hover:bg-emerald-500/20">
            <Globe className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="text-lg font-bold text-white">
            Domain<span className="text-emerald-400">Buddy</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 sm:flex">
          <Link
            href="/"
            className="rounded-lg px-3 py-2 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
          >
            Search
          </Link>
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <span className="mx-2 text-xs text-zinc-600">|</span>
              <span className="text-sm text-zinc-500">
                {session.user?.email}
              </span>
              <button
                onClick={() => signOut()}
                className="ml-2 flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-zinc-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/auth/signin"
              className="group relative ml-3 overflow-hidden rounded-lg px-4 py-1.5 text-sm font-medium text-black transition"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-500 transition group-hover:from-emerald-300 group-hover:to-emerald-400" />
              <span className="relative flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Sign In
              </span>
            </Link>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/5 sm:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/5 px-4 pb-4 pt-2 sm:hidden">
          <div className="flex flex-col gap-1">
            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-sm text-zinc-400 transition hover:bg-white/5"
              onClick={() => setOpen(false)}
            >
              Search
            </Link>
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-lg px-3 py-2 text-sm text-zinc-400 transition hover:bg-white/5"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="rounded-lg px-3 py-2 text-sm font-medium text-emerald-400 transition hover:bg-emerald-500/10"
                onClick={() => setOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useState } from "react"
import { Globe, Menu, X, LogOut, LayoutDashboard } from "lucide-react"

export default function Navbar() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)

  return (
    <nav className="border-b border-zinc-800 bg-black">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-white"
        >
          <Globe className="h-6 w-6 text-emerald-400" />
          DomainBuddy
        </Link>

        <div className="hidden items-center gap-6 sm:flex">
          <Link
            href="/"
            className="text-sm text-zinc-400 transition hover:text-white"
          >
            Search
          </Link>
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-1 text-sm text-zinc-400 transition hover:text-white"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <span className="text-sm text-zinc-500">
                {session.user?.email}
              </span>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1 rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition hover:bg-zinc-800"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/auth/signin"
              className="rounded-lg bg-emerald-500 px-4 py-1.5 text-sm font-medium text-black transition hover:bg-emerald-400"
            >
              Sign In
            </Link>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="text-zinc-400 sm:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-zinc-800 px-4 pb-4 pt-2 sm:hidden">
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="text-sm text-zinc-400"
              onClick={() => setOpen(false)}
            >
              Search
            </Link>
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm text-zinc-400"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-1 text-sm text-red-400"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="text-sm font-medium text-emerald-400"
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

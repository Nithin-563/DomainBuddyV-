"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, Lock, Loader2, Sparkles } from "lucide-react"

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError("Invalid credentials")
      setLoading(false)
    } else {
      router.push("/dashboard")
      router.refresh()
    }
  }

  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
            <Sparkles className="h-6 w-6 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="mt-1 text-sm text-zinc-500">Sign in to DomainBuddy</p>
        </div>

        <div className="glass rounded-2xl p-6">
          <form onSubmit={handleCredentialsSignIn} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-zinc-400">
                Email
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 transition focus-within:border-emerald-500/30 focus-within:bg-emerald-500/5">
                <Mail className="h-4 w-4 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 bg-transparent text-white outline-none placeholder:text-zinc-700"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-zinc-400">
                Password
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 transition focus-within:border-emerald-500/30 focus-within:bg-emerald-500/5">
                <Lock className="h-4 w-4 text-zinc-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="flex-1 bg-transparent text-white outline-none placeholder:text-zinc-700"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-xl py-2.5 font-medium text-black transition"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 transition group-hover:from-emerald-300 group-hover:to-teal-300" />
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                Sign In
              </span>
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 border-t border-white/5" />
            <span className="text-xs text-zinc-600">or</span>
            <div className="flex-1 border-t border-white/5" />
          </div>

          <button
            onClick={() =>
              signIn("google", { callbackUrl: "/dashboard" })
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm text-zinc-300 transition hover:bg-white/10"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-700">
          By continuing, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  )
}

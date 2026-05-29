import DomainSearch from "@/components/DomainSearch"
import {
  Globe,
  Zap,
  Shield,
  DollarSign,
  Sparkles,
  ArrowRight,
} from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "AI-Powered Suggestions",
    desc: "Get smart domain ideas based on your keywords in seconds.",
  },
  {
    icon: Shield,
    title: "Instant Availability",
    desc: "Real-time domain lookup via RDAP — no waiting.",
  },
  {
    icon: DollarSign,
    title: "Best Prices",
    desc: "Register domains through trusted partners at great rates.",
  },
  {
    icon: Globe,
    title: "All TLDs",
    desc: ".com .net .org .io .ai .dev and 1000+ more.",
  },
]

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 pb-32 pt-24 text-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-500/5 blur-[120px]" />
          <div className="absolute right-0 top-1/4 h-[400px] w-[400px] rounded-full bg-teal-500/3 blur-[100px]" />
          <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-purple-500/3 blur-[80px]" />
        </div>

        <div className="relative">
          <div className="mb-6 inline-flex animate-float items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs text-emerald-300">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Domain Search
          </div>

          <h1 className="mb-4 max-w-4xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl">
            Find your perfect
            <br />
            <span className="gradient-text">domain name</span>
          </h1>

          <p className="mx-auto mb-12 max-w-xl text-lg text-zinc-500">
            Search millions of domains, get AI-powered name suggestions,
            and register with trusted providers in seconds.
          </p>

          <div className="flex justify-center">
            <DomainSearch />
          </div>

          <div className="mx-auto mt-24 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="glass glass-hover group rounded-2xl p-5 text-left transition duration-300"
              >
                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/5 ring-1 ring-emerald-500/10 transition group-hover:bg-emerald-500/10 group-hover:ring-emerald-500/20">
                  <f.icon className="h-4 w-4 text-emerald-400" />
                </div>
                <h3 className="mb-1 text-sm font-medium text-white">
                  {f.title}
                </h3>
                <p className="text-xs leading-relaxed text-zinc-500">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 px-4 py-6 text-center text-xs text-zinc-700">
        <div className="sr-only">
          Impact-Site-Verification: 53b8bfe3-3dd1-434f-9592-1f212631a0ff
        </div>
        DomainBuddy uses affiliate links. We earn a commission when you
        purchase through our partners.
      </footer>
    </main>
  )
}

import DomainSearch from "@/components/DomainSearch"
import { Globe, Zap, Shield, DollarSign } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "AI-Powered Suggestions",
    desc: "Get smart domain ideas based on your keywords.",
  },
  {
    icon: Shield,
    title: "Instant Availability",
    desc: "Real-time domain lookup via RDAP.",
  },
  {
    icon: DollarSign,
    title: "Best Prices",
    desc: "Find & register domains through trusted partners.",
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
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-zinc-400">
          <Globe className="h-3.5 w-3.5 text-emerald-400" />
          AI-Powered Domain Search
        </div>

        <h1 className="mb-4 max-w-4xl text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
          Find your perfect
          <span className="block text-emerald-400">domain name</span>
        </h1>

        <p className="mb-10 max-w-xl text-lg text-zinc-400">
          Search millions of domains, get AI-powered name suggestions, and
          register with trusted providers in seconds.
        </p>

        <DomainSearch />

        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 text-left"
            >
              <f.icon className="mb-3 h-5 w-5 text-emerald-400" />
              <h3 className="mb-1 text-sm font-medium text-white">
                {f.title}
              </h3>
              <p className="text-xs text-zinc-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-zinc-800 px-4 py-6 text-center text-xs text-zinc-600">
        DomainBuddy uses affiliate links. We earn a commission when you
        purchase through our partners.
      </footer>
    </main>
  )
}

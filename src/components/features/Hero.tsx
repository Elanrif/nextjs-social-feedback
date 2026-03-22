import { Button } from "@components/ui/button";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Code,
  Rocket,
  Shield,
  LayoutDashboard,
  Users,
  Settings,
} from "lucide-react";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden
        bg-slate-950"
    >
      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.2) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Aurora gradients */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-225 h-150 bg-indigo-500/15
            rounded-full blur-3xl"
        />
        <div className="absolute top-1/3 -left-40 w-125 h-125 bg-violet-500/10 rounded-full
          blur-3xl" />
        <div className="absolute top-1/4 -right-40 w-125 h-125 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        {/* Top content */}
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border
              border-indigo-500/30 bg-indigo-500/10 mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-sm text-indigo-300 font-medium">
              Next.js 15 · React 19 · TypeScript · Tailwind v4
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 text-white
              leading-[0.92]"
          >
            Lancez votre
            <br />
            <span
              className="bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text
                text-transparent"
            >
              app en minutes
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Un boilerplate Next.js production-ready avec authentification, dashboard admin,
            composants UI et bien plus. Concentrez-vous sur votre produit.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button
              size="lg"
              className="px-8 h-12 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg
                shadow-indigo-500/30 border-0 group transition-all duration-200 hover:scale-105"
            >
              <Rocket className="w-4 h-4 mr-2" />
              Commencer maintenant
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 h-12 border-white/15 bg-white/5 text-white hover:bg-white/10
                hover:border-white/25 transition-all duration-200"
              asChild
            >
              <a
                href="https://github.com/Elanrif/kickstart-nextjs-starter-kit"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <GithubIcon className="w-4 h-4 mr-2" />
                Voir sur GitHub
              </a>
            </Button>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-16">
            {[
              {
                icon: <Zap className="w-3.5 h-3.5" />,
                text: "Ultra rapide",
              },
              {
                icon: <Shield className="w-3.5 h-3.5" />,
                text: "Auth sécurisée",
              },
              {
                icon: <Code className="w-3.5 h-3.5" />,
                text: "100% TypeScript",
              },
              {
                icon: <Sparkles className="w-3.5 h-3.5" />,
                text: "shadcn/ui",
              },
            ].map((pill, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border
                  border-white/10 text-slate-400 text-sm"
              >
                <span className="text-slate-500">{pill.icon}</span>
                {pill.text}
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard Mockup */}
        <div className="relative max-w-5xl mx-auto">
          {/* Glow behind mockup */}
          <div className="absolute -inset-4 bg-indigo-500/10 rounded-3xl blur-2xl" />

          {/* Browser window */}
          <div
            className="relative rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-sm
              shadow-2xl shadow-black/50 overflow-hidden"
          >
            {/* Browser bar */}
            <div
              className="flex items-center gap-3 px-5 py-3.5 border-b border-white/10
                bg-slate-950/60"
            >
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 flex justify-center">
                <div
                  className="px-4 py-1 rounded-md bg-slate-800/80 border border-white/10 text-xs
                    text-slate-400 font-mono"
                >
                  localhost:3000/dashboard
                </div>
              </div>
            </div>

            {/* Dashboard preview */}
            <div className="flex h-72 sm:h-96">
              {/* Sidebar */}
              <div
                className="hidden sm:flex flex-col w-56 bg-slate-950 border-r border-white/10 p-4
                  gap-1.5 shrink-0"
              >
                <div className="flex items-center gap-2.5 mb-4 px-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-white">Kickstart</span>
                </div>
                {[
                  {
                    icon: <LayoutDashboard className="w-4 h-4" />,
                    label: "Dashboard",
                    active: true,
                  },
                  {
                    icon: <Users className="w-4 h-4" />,
                    label: "Utilisateurs",
                    active: false,
                  },
                  {
                    icon: <Settings className="w-4 h-4" />,
                    label: "Paramètres",
                    active: false,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm
                    ${item.active ? "bg-indigo-600/20 text-indigo-300" : "text-slate-500"}`}
                  >
                    {item.icon}
                    {item.label}
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div className="flex-1 p-5 overflow-hidden">
                {/* Stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {[
                    {
                      label: "Utilisateurs",
                      value: "2,840",
                      color: "text-indigo-400",
                    },
                    {
                      label: "Revenus",
                      value: "€12.4k",
                      color: "text-emerald-400",
                    },
                    {
                      label: "Sessions",
                      value: "18,392",
                      color: "text-purple-400",
                    },
                    {
                      label: "Taux conv.",
                      value: "3.24%",
                      color: "text-pink-400",
                    },
                  ].map((stat, i) => (
                    <div key={i} className="bg-slate-800/60 border border-white/5 rounded-xl p-3">
                      <div className="text-slate-500 text-xs mb-1">{stat.label}</div>
                      <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                    </div>
                  ))}
                </div>

                {/* Chart placeholder */}
                <div
                  className="bg-slate-800/40 border border-white/5 rounded-xl p-4 mb-3 h-28 flex
                    items-end gap-1.5"
                >
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm"
                      style={{
                        height: `${h}%`,
                        background:
                          i === 10 ? "rgba(99,102,241,0.9)" : `rgba(99,102,241,${0.2 + i * 0.02})`,
                      }}
                    />
                  ))}
                </div>

                {/* Table placeholder */}
                <div className="bg-slate-800/40 border border-white/5 rounded-xl overflow-hidden">
                  <div className="grid grid-cols-3 px-4 py-2 border-b border-white/5">
                    {["Nom", "Statut", "Date"].map((h, i) => (
                      <div key={i} className="text-xs text-slate-500 font-medium">
                        {h}
                      </div>
                    ))}
                  </div>
                  {[
                    {
                      name: "Alice Martin",
                      status: "Actif",
                      color: "bg-emerald-500",
                    },
                    {
                      name: "Bob Dupont",
                      status: "Inactif",
                      color: "bg-slate-500",
                    },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-3 px-4 py-2.5 border-b border-white/5 last:border-0"
                    >
                      <div className="text-xs text-slate-300">{row.name}</div>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${row.color}`} />
                        <span className="text-xs text-slate-400">{row.status}</span>
                      </div>
                      <div className="text-xs text-slate-500">Aujourd&apos;hui</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mt-16">
          {[
            {
              number: "15+",
              label: "Composants",
              color: "text-indigo-400",
            },
            {
              number: "100%",
              label: "TypeScript",
              color: "text-purple-400",
            },
            {
              number: "0",
              label: "Config requise",
              color: "text-pink-400",
            },
            {
              number: "∞",
              label: "Possibilités",
              color: "text-cyan-400",
            },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className={`text-3xl font-bold mb-1 ${stat.color}`}>{stat.number}</div>
              <div className="text-slate-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-5 h-8 border border-white/20 rounded-full flex justify-center pt-1.5">
          <div className="w-0.5 h-2 bg-white/40 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}

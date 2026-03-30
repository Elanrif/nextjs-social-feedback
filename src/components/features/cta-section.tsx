import { Button } from "@/components/ui/button";
import {
  Rocket,
  ArrowRight,
  BookOpen,
  Sparkles,
  Star,
  Database,
  Zap,
  Shield,
  Code2,
  Palette,
  Globe,
} from "lucide-react";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

const features = [
  {
    icon: <Zap className="w-4 h-4" />,
    title: "Performance",
    items: ["Next.js 15 App Router", "Server Components", "Streaming"],
    accent: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
  },
  {
    icon: <Code2 className="w-4 h-4" />,
    title: "DX Optimisée",
    items: ["TypeScript strict", "ESLint + Prettier", "Hot Reload"],
    accent: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    icon: <Palette className="w-4 h-4" />,
    title: "UI Moderne",
    items: ["Tailwind CSS v4", "shadcn/ui", "Responsive"],
    accent: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    icon: <Shield className="w-4 h-4" />,
    title: "Authentification",
    items: ["JWT Sessions", "Routes protégées", "Middleware"],
    accent: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    icon: <Database className="w-4 h-4" />,
    title: "Données",
    items: ["ORM moderne", "Type Safety", "Migrations"],
    accent: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  {
    icon: <Globe className="w-4 h-4" />,
    title: "Production Ready",
    items: ["Vercel Deploy", "CI/CD", "Analytics"],
    accent: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
  },
];

export default function CTASection() {
  return (
    <section id="features" className="relative py-24 bg-slate-950 overflow-hidden">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.15) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Glow accents */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-225 h-96 bg-indigo-500/8
            rounded-full blur-3xl"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border
              border-indigo-500/30 bg-indigo-500/10 mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-sm text-indigo-300 font-medium">
              Tout ce qu&apos;il vous faut
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            Construisez quelque chose{" "}
            <span className="bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text
              text-transparent">
              d&apos;incroyable
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Démarrez votre prochain projet avec notre template et concentrez-vous sur ce qui compte
            : créer des produits que vos utilisateurs adoreront.
          </p>
        </div>

        {/* Bento features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group rounded-2xl border ${feature.border} ${feature.bg} p-6
              hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-9 h-9 rounded-xl bg-slate-900/60 border border-white/10 flex
                  items-center justify-center ${feature.accent}`}
                >
                  {feature.icon}
                </div>
                <h3 className="font-bold text-white">{feature.title}</h3>
              </div>
              <ul className="space-y-1.5">
                {feature.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-400">
                    <div className={`w-1 h-1 rounded-full shrink-0 ${feature.accent} bg-current`} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Card */}
        <div className="relative rounded-3xl border border-white/10 bg-white/3 overflow-hidden">
          {/* Inner glow */}
          <div
            className="absolute inset-0 bg-linear-to-br from-indigo-500/5 via-transparent
              to-purple-500/5"
          />

          <div className="relative px-8 py-14 sm:px-16 text-center">
            <div className="max-w-xl mx-auto">
              {/* Rocket icon */}
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl
                  bg-indigo-500/15 border border-indigo-500/30 mb-6"
              >
                <Rocket className="w-7 h-7 text-indigo-400" />
              </div>

              <h3 className="text-3xl md:text-4xl font-black text-white mb-4">Prêt à démarrer ?</h3>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Utilisez ce template pour votre prochain projet et gagnez des jours de
                configuration.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <Button
                  size="lg"
                  className="px-8 h-12 bg-white text-slate-900 hover:bg-slate-100 shadow-lg
                    shadow-black/20 font-semibold group transition-all duration-200 hover:scale-105"
                  asChild
                >
                  <a
                    href="https://github.com/Elanrif/kickstart-nextjs-social-feedback"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <GithubIcon className="mr-2 h-4 w-4" />
                    Utiliser ce template
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform
                      group-hover:translate-x-1" />
                  </a>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 h-12 border-white/15 bg-white/5 text-white hover:bg-white/10
                    hover:border-white/25 transition-all duration-200"
                  asChild
                >
                  <a href="#docs" className="flex items-center">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Documentation
                  </a>
                </Button>
              </div>

              {/* Social proof */}
              <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span>Utilisé par +1000 développeurs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

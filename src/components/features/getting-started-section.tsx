import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Download, Code2, Rocket, Terminal } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Cloner le dépôt",
    description: "Récupérez le code complet avec toutes les configurations incluses.",
    icon: <Download className="w-5 h-5" />,
    accent: "from-indigo-500 to-indigo-600",
    glow: "shadow-indigo-500/20",
  },
  {
    step: "02",
    title: "Installer les dépendances",
    description: "Installez automatiquement tous les packages nécessaires.",
    icon: <Code2 className="w-5 h-5" />,
    accent: "from-purple-500 to-purple-600",
    glow: "shadow-purple-500/20",
  },
  {
    step: "03",
    title: "Commencer à coder",
    description: "Lancez le serveur de développement et codez immédiatement.",
    icon: <Rocket className="w-5 h-5" />,
    accent: "from-pink-500 to-pink-600",
    glow: "shadow-pink-500/20",
  },
];

const commands = [
  {
    prompt: "$",
    text: "git clone https://github.com/Elanrif/kickstart-nextjs-social-feedback.git",
  },
  {
    prompt: "$",
    text: "cd kickstart-nextjs-social-feedback",
  },
  { prompt: "$", text: "npm install" },
  {
    prompt: "$",
    text: "cp .env.example .env.local",
  },
  { prompt: "$", text: "npm run dev" },
  {
    prompt: "→",
    text: "Ready on http://localhost:3000",
    color: "text-cyan-400",
  },
];

export default function GettingStartedSection() {
  return (
    <section id="getting-started" className="relative py-24 bg-slate-950 overflow-hidden">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.15) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Accent glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-indigo-500/8 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-purple-500/8 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge
            className="mb-5 px-4 py-1.5 text-sm font-medium bg-indigo-500/10 border
              border-indigo-500/30 text-indigo-300 rounded-full"
          >
            <Zap className="w-3.5 h-3.5 mr-1.5" />
            Démarrage rapide
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            Prêt en{" "}
            <span className="bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text
              text-transparent">
              quelques minutes
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Clonez le dépôt et commencez à construire votre prochaine application. Tout est
            configuré et prêt à l&apos;emploi.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {steps.map((item, index) => (
            <div
              key={index}
              className="group relative rounded-2xl border border-white/8 bg-white/3 p-7
                hover:border-white/15 hover:bg-white/5 transition-all duration-300"
            >
              {/* Step number */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className={`w-10 h-10 rounded-xl bg-linear-to-br ${item.accent} shadow-lg
                  ${item.glow} flex items-center justify-center text-white`}
                >
                  {item.icon}
                </div>
                <span className="text-3xl font-black text-white/10 tabular-nums">{item.step}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
              {/* Connector line (hidden on last) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 -right-2.5 w-5 h-px bg-white/10" />
              )}
            </div>
          ))}
        </div>

        {/* Terminal */}
        <div className="max-w-3xl mx-auto">
          <Card
            className="overflow-hidden border border-white/10 bg-slate-900 shadow-2xl
              shadow-black/40"
          >
            {/* Terminal header */}
            <div
              className="flex items-center gap-3 px-5 py-3.5 border-b border-white/8
                bg-slate-950/60"
            >
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 flex justify-center">
                <span className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  Terminal
                </span>
              </div>
            </div>

            {/* Terminal body */}
            <CardContent className="p-0">
              <div className="p-6 font-mono text-sm space-y-3">
                {commands.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 group/line">
                    <span
                      className={
                        item.prompt === "→" ? "text-cyan-400 mt-0.5" : "text-indigo-400 mt-0.5"
                      }
                    >
                      {item.prompt}
                    </span>
                    <code
                      className={
                        item.color ?? "text-slate-300 group-hover/line:text-white transition-colors"
                      }
                    >
                      {item.text}
                    </code>
                  </div>
                ))}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-green-400 text-xs">✓ Ready in 1.2s</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

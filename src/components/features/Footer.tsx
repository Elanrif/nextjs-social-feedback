import { ROUTES } from "@/utils/routes";
import Link from "next/link";
import { Sparkles, Github, Twitter, Mail, ExternalLink, Heart } from "lucide-react";

const footerSections = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Documentation", href: "#docs" },
    {
      label: "Getting Started",
      href: "#getting-started",
    },
    {
      label: "Examples",
      href: "https://github.com/Elanrif/kickstart-nextjs-social-feedback/tree/main/examples",
    },
  ],
  resources: [
    {
      label: "Next.js Docs",
      href: "https://nextjs.org/docs",
    },
    {
      label: "Tailwind CSS",
      href: "https://tailwindcss.com",
    },
    {
      label: "shadcn/ui",
      href: "https://ui.shadcn.com",
    },
    {
      label: "TypeScript",
      href: "https://typescriptlang.org",
    },
  ],
  community: [
    {
      label: "GitHub",
      href: "https://github.com/Elanrif/kickstart-nextjs-social-feedback",
    },
    {
      label: "Discord",
      href: "https://discord.gg/nextjs",
    },
    {
      label: "Twitter",
      href: "https://twitter.com/nextjs",
    },
    {
      label: "Discussions",
      href: "https://github.com/Elanrif/kickstart-nextjs-social-feedback/discussions",
    },
  ],
  legal: [
    {
      label: "MIT License",
      href: "https://github.com/Elanrif/kickstart-nextjs-social-feedback/blob/main/LICENSE",
    },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Cookies", href: "/cookies" },
  ],
};

const sectionTitles: Record<string, string> = {
  product: "Product",
  resources: "Resources",
  community: "Community",
  legal: "Legal",
};

const { HOME } = ROUTES;

export function Footer() {
  return (
    <footer className="relative bg-slate-900 text-white overflow-hidden">
      {/* Thin white top bar */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-white/20" />
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl
            animate-pulse"
        />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl
            animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80
            bg-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href={HOME} className="flex items-center gap-3 mb-6 group">
              <div className="relative">
                <div
                  className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center
                    shadow-lg group-hover:scale-110 transition-transform duration-300"
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full
                    animate-pulse"
                />
              </div>
              <span className="text-2xl font-bold text-blue-400">Kickstart</span>
            </Link>

            <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-md">
              The ultimate Next.js boilerplate for building modern, performant and scalable web
              applications in minutes.
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              {[
                {
                  icon: <Github className="w-5 h-5" />,
                  href: "https://github.com/Elanrif/kickstart-nextjs-social-feedback",
                  label: "GitHub",
                },
                {
                  icon: <Twitter className="w-5 h-5" />,
                  href: "https://twitter.com",
                  label: "Twitter",
                },
                {
                  icon: <Mail className="w-5 h-5" />,
                  href: "mailto:contact@kickstart.dev",
                  label: "Email",
                },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center
                    justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-all
                    duration-300 group"
                  aria-label={social.label}
                >
                  <span className="group-hover:scale-110 transition-transform duration-300">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(footerSections).map(([sectionKey, links]) => (
              <div key={sectionKey}>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
                  {sectionTitles[sectionKey] ?? sectionKey}
                </h3>
                <ul className="space-y-4">
                  {links.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="flex items-center gap-2 text-gray-400 hover:text-white
                          transition-colors duration-200 group"
                      >
                        <span className="group-hover:translate-x-1 transition-transform
                          duration-200">
                          {link.label}
                        </span>
                        {link.href.startsWith("http") && (
                          <ExternalLink
                            className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity
                              duration-200"
                          />
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <div className="flex items-center gap-2 text-gray-400">
              <span>© {new Date().getFullYear()} nextjs social feedback.</span>
              <span>Built with</span>
              <Heart className="w-4 h-4 text-red-400 animate-pulse" />
              <span>by passionate developers</span>
            </div>

            {/* Tech Stack */}
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span>Powered by</span>
              <div className="flex items-center gap-4">
                {[
                  {
                    name: "Next.js",
                    href: "https://nextjs.org",
                  },
                  {
                    name: "Vercel",
                    href: "https://vercel.com",
                  },
                  {
                    name: "TypeScript",
                    href: "https://typescriptlang.org",
                  },
                ].map((tech, index) => (
                  <a
                    key={index}
                    href={tech.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors duration-200"
                  >
                    {tech.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Message */}
          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-gray-500">
              Start your next project with the best Next.js starter kit
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

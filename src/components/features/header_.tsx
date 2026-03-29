"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { SignOutButton } from "@/components/features/auth/sign-out-button";
import { ROUTES } from "@/utils/routes";
import { useSession } from "next-auth/react";
import Logo from "./logo";
import { Mail, LayoutDashboard, LogIn, UserPlus, Menu, X, UserCheck } from "lucide-react";
import { cn } from "@/utils/utils";

const navLinks = [
  { href: "#features", label: "Fonctionnalités" },
  { href: "#docs", label: "Documentation" },
  { href: "#getting-started", label: "Démarrer" },
  {
    href: "#contact",
    label: "Nous contacter",
    icon: Mail,
  },
];

const { SIGN_IN, SIGN_UP, DASHBOARD } = ROUTES;

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const isAuthenticated = !!session?.user;

  const navLinkClass = isScrolled
    ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100/70"
    : "text-white/80 hover:text-white hover:bg-white/10";

  const navContactClass = isScrolled
    ? "text-indigo-600 hover:bg-indigo-50"
    : "text-indigo-300 hover:bg-white/10";

  const dashboardClass = isScrolled
    ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100/70"
    : "text-white/80 hover:text-white hover:bg-white/10";

  const loginClass = isScrolled
    ? "text-gray-700 border-gray-200 hover:bg-gray-50"
    : "text-white border-white/25 hover:bg-white/10";

  const burgerClass = isScrolled
    ? "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
    : "text-white/80 hover:text-white hover:bg-white/10";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-sm shadow-black/5"
          : "bg-transparent"
        }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-8">
          <Logo variant={isScrolled ? "dark" : "light"} />

          <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium
                transition-all ${link.icon ? navContactClass : navLinkClass}`}
              >
                {link.icon && <link.icon className="w-3 h-3" />}
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2 shrink-0">
            {(() => {
              if (isLoading) {
                return (
                  <>
                    <div className="h-7 w-16 bg-white/20 animate-pulse rounded-lg" />
                    <div className="h-7 w-20 bg-white/20 animate-pulse rounded-lg" />
                  </>
                );
              }
              if (isAuthenticated) {
                return (
                  <>
                    {session.user.role === "ADMIN" ? (
                      <Link
                        href={DASHBOARD}
                        className={cn(
                          "flex items-center border border-white gap-1.5 px-3.5 py-1.5 rounded-lg",
                          "text-xs font-medium transition-all",
                          dashboardClass,
                        )}
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        Dashboard
                      </Link>
                    ) : (
                      <Link
                        href={DASHBOARD}
                        className={cn(
                          "flex items-center border border-white gap-1.5 px-3.5 py-1.5 rounded-lg",
                          "text-cyan-400 text-xs font-medium transition-all",
                          dashboardClass,
                        )}
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        Mon compte
                      </Link>
                    )}
                    <SignOutButton variant="destructive" />
                  </>
                );
              }
              return (
                <>
                  <Link
                    href={SIGN_IN}
                    className={cn(
                      "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg",
                      "text-xs font-medium border transition-all",
                      loginClass,
                    )}
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    Connexion
                  </Link>
                  <Link
                    href={SIGN_UP}
                    className={cn(
                      "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg",
                      "text-xs font-semibold text-white",
                      "bg-linear-to-r from-green-500 to-emerald-600",
                      "hover:from-green-600 hover:to-emerald-700",
                      "shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all",
                    )}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    S&apos;inscrire
                  </Link>
                </>
              );
            })()}
          </div>

          <button
            className={`md:hidden p-1.5 rounded-lg transition-colors ${burgerClass}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen
            ? "max-h-96 bg-white/90 backdrop-blur-lg border-t border-white/20"
            : "max-h-0"
          }`}
      >
        <div className="mx-auto max-w-7xl px-4 py-3 space-y-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium
              transition-colors ${
                link.icon
                  ? "text-indigo-600 hover:bg-indigo-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.icon && <link.icon className="w-3.5 h-3.5" />}
              {link.label}
            </Link>
          ))}

          <div className="pt-2 pb-1 flex gap-2">
            {isAuthenticated ? (
              <div className="flex-1">
                <SignOutButton
                  className="w-full"
                  variant="destructive"
                  onSignOut={() => setIsMobileMenuOpen(false)}
                />
              </div>
            ) : (
              <>
                <Link
                  href={SIGN_IN}
                  className={cn(
                    `flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs
                      font-medium text-gray-700`,
                    "border border-gray-200 hover:bg-gray-50 transition-colors",
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Connexion
                </Link>
                <Link
                  href={SIGN_UP}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs",
                    `font-semibold text-white bg-linear-to-r from-green-500 to-emerald-600
                      shadow-sm`,
                    "transition-all",
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  S&apos;inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

"use client";

import { Activity } from "lucide-react";
import Image from "next/image";

type HeroUser = { firstName?: string | null; email?: string | null; avatarUrl?: string | null };

export function DashboardHero({ user }: { user: HeroUser }) {
  const initials =
    user?.firstName?.slice(0, 2).toUpperCase() || user?.email?.slice(0, 2).toUpperCase() || "AD";

  return (
    <div className="card-gradient relative overflow-hidden rounded-2xl p-8 shadow-2xl">
      <div
        className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full
          bg-blue-500/20 blur-3xl"
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full
          bg-indigo-500/20 blur-3xl"
      />
      <div className="relative flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-400 text-sm font-medium">
            <Activity className="w-4 h-4" />
            <span>Vue d&apos;ensemble</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Bonjour, {user?.firstName || "Admin"} 👋
          </h1>
          <p className="text-slate-400 text-sm max-w-md">
            Voici un résumé de votre activité. Tout se passe bien aujourd&apos;hui.
          </p>
        </div>
        <div className="hidden md:flex flex-col items-center gap-2">
          <div
            className="h-16 w-16 rounded-full bg-linear-to-br from-blue-400 to-indigo-600 flex
              items-center justify-center text-white text-xl font-bold shadow-lg ring-2
              ring-white/10"
          >
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={`Avatar de ${user.firstName || user.email}`}
                width={120}
                height={120}
                className="h-full w-full object-cover rounded-full"
                priority
              />
            ) : (
              <div
                className="h-full w-full bg-linear-to-br from-indigo-400 to-blue-600 flex
                  items-center justify-center text-white text-2xl font-bold"
              >
                {initials}
              </div>
            )}
          </div>
          <span className="text-xs text-slate-400">{user?.email}</span>
        </div>
      </div>
    </div>
  );
}

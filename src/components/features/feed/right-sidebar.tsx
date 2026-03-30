"use client";

import Link from "next/link";
import { useSession , signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Trophy, Sparkles, LogOut } from "lucide-react";

export function RightSidebar() {
  const { data: session } = useSession();
  const user = session?.user;

  if (user) {
    return (
      <aside className="sticky top-6 h-fit w-72 shrink-0 mt-6 hidden lg:block">
        <div
          className="border border-border rounded-xl p-6 bg-linear-to-br from-blue-50 to-indigo-50
            dark:from-blue-950/30 dark:to-indigo-950/30"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Bienvenue!</h3>
          </div>

          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            Salut <span className="font-semibold">{user.firstName || user.email}</span>, prêt à
            partager vos pensées avec la communauté?
          </p>

          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-3">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Connecté</span>
            </div>
            <div className="flex items-center gap-3">
              <MessageCircle className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Participez aux discussions
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Gagnez en influence</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full mt-4 bg-red-500 text-white justify-center gap-2"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="w-4 h-4" />
            Se déconnecter
          </Button>
        </div>

        <div
          className="mt-4 flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs
            text-muted-foreground"
        >
          <a href="#" className="hover:underline">
            Conditions
          </a>
          <a href="#" className="hover:underline">
            Confidentialité
          </a>
          <a href="#" className="hover:underline">
            Cookies
          </a>
          <a href="#" className="hover:underline">
            Aide
          </a>
          <span>© 2026</span>
        </div>
      </aside>
    );
  }

  return (
    <aside className="sticky top-6 h-fit w-72 shrink-0 mt-6 hidden lg:block">
      <div className="border border-border rounded-xl p-5 bg-card">
        <h3 className="font-bold text-base text-center leading-snug">Rejoignez la communauté</h3>
        <p className="text-sm text-muted-foreground text-center mt-1 mb-4">
          Découvrez les discussions et participez.
        </p>
        <Button className="w-full" asChild>
          <Link href="/sign-up">Créer un compte</Link>
        </Button>
        <Button variant="outline" className="w-full mt-2" asChild>
          <Link href="/sign-in">Se connecter</Link>
        </Button>
      </div>

      <div
        className="mt-4 flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground"
      >
        <a href="#" className="hover:underline">
          Conditions
        </a>
        <a href="#" className="hover:underline">
          Confidentialité
        </a>
        <a href="#" className="hover:underline">
          Cookies
        </a>
        <a href="#" className="hover:underline">
          Aide
        </a>
        <span>© 2026</span>
      </div>
    </aside>
  );
}

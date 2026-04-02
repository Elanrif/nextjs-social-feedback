"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import {
  Home,
  Search,
  Plus,
  Heart,
  Bookmark,
  MoreHorizontal,
  User,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PostCreateModal } from "./post-create-modal";

const NAV_ITEMS = [
  { icon: Home, label: "Accueil", href: "/" },
  { icon: Search, label: "Rechercher", href: "/search" },
  { icon: Plus, label: "Créer", href: "/create" },
  { icon: Heart, label: "Activité", href: "/activity" },
  { icon: Bookmark, label: "Enregistrés", href: "/saved" },
] as const;

export function LeftSidebar() {
  const pathname = usePathname();
  const [openModal, setOpenModal] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleCreateClick = () => {
    if (!session?.user) {
      toast.warning("Veuillez vous connecter pour créer un post");
      router.push("/sign-in");
      return;
    }
    setOpenModal(true);
  };

  // Vérifier si admin et connecté
  const isAdmin = session?.user?.role === "ADMIN";
  const isConnected = !!session?.user;

  return (
    <>
      <aside
        className="sticky top-0 h-screen flex flex-col items-center justify-between py-6 w-18
          border-r border-border shrink-0"
      >
        {/* Navigation principale */}
        <nav className="flex flex-col items-center gap-1">
          {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
            const active = pathname === href;
            // Si c'est le bouton "Créer", ouvrir le modal
            if (label === "Créer") {
              return (
                <Button
                  key={label}
                  variant="ghost"
                  size="icon"
                  className="size-12 rounded-xl hover:bg-accent"
                  title={label}
                  onClick={handleCreateClick}
                >
                  <Icon className="size-6" />
                </Button>
              );
            }
            return (
              <Button
                key={label}
                variant="ghost"
                size="icon"
                className={cn("size-12 rounded-xl", active && "bg-accent")}
                title={label}
              >
                <Icon className={cn("size-6", active && "fill-current")} />
              </Button>
            );
          })}
        </nav>

        {/* Section bas: Dashboard (admin), Profil (connecté), More */}
        <div className="flex flex-col items-center gap-1">
          {isAdmin && (
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "size-12 rounded-xl",
                  pathname.startsWith("/dashboard") && "bg-accent",
                )}
                title="Dashboard"
              >
                <LayoutDashboard
                  className={cn("size-6", pathname.startsWith("/dashboard") && "fill-current")}
                />
              </Button>
            </Link>
          )}

          {isConnected && (
            <Link href="/account/profile">
              <Button
                variant="ghost"
                size="icon"
                className={cn("size-12 rounded-xl", pathname === "/account/profile" && "bg-accent")}
                title="Profil"
              >
                <User className={cn("size-6", pathname === "/account/profile" && "fill-current")} />
              </Button>
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="size-12 rounded-xl hover:bg-accent"
            title="Plus"
          >
            <MoreHorizontal className="size-6" />
          </Button>
        </div>
      </aside>

      <PostCreateModal open={openModal} onOpenChange={setOpenModal} />
    </>
  );
}

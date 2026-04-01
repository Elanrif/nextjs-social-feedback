"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { Home, Search, Plus, Heart, User, Bookmark, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PostCreateModal } from "./post-create-modal";

const NAV_ITEMS = [
  { icon: Home, label: "Accueil", href: "/" },
  { icon: Search, label: "Rechercher", href: "/search" },
  { icon: Plus, label: "Créer", href: "/create" },
  { icon: Heart, label: "Activité", href: "/activity" },
  { icon: User, label: "Profil", href: "/account/profile" },
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

  return (
    <>
      <aside
        className="sticky top-0 h-screen flex flex-col items-center justify-between py-6 w-18
          border-r border-border shrink-0"
      >
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
        <Button
          variant="ghost"
          size="icon"
          className="size-12 rounded-xl hover:bg-accent"
          title="Plus"
        >
          <MoreHorizontal className="size-6" />
        </Button>
      </aside>

      <PostCreateModal open={openModal} onOpenChange={setOpenModal} />
    </>
  );
}

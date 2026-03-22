"use client";

import * as React from "react";
import { HomeIcon, LayoutGrid, Tag, Package, Users } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { User } from "@/lib/users/models/user.model";
import { ROUTES } from "@/utils/routes";
import { authClient } from "@/lib/auth/api/auth.client";
import LoadingPage from "@components/features/loading-page";

const { DASHBOARD, PRODUCTS, CATEGORIES, USERS } = ROUTES;

const data = {
  teams: [
    {
      name: "Espace Admin",
      logo: LayoutGrid,
      plan: "Gestion de la boutique",
    },
  ],
  navMain: [
    {
      title: "Accueil",
      url: DASHBOARD,
      icon: HomeIcon,
    },
    {
      title: "Boutique",
      url: "#",
      icon: LayoutGrid,
      isActive: true,
      items: [
        {
          title: "Catégories",
          url: `${DASHBOARD}${CATEGORIES}`,
          icon: Tag,
        },
        {
          title: "Produits",
          url: `${DASHBOARD}${PRODUCTS}`,
          icon: Package,
        },
        {
          title: "Utilisateurs",
          url: `${DASHBOARD}${USERS}`,
          icon: Users,
        },
      ],
    },
  ],
};

const sidebarBg = "bg-slate-950 text-white";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [auth, setAuth] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const response = await authClient.getCurrentUser();
        if (!response.ok) {
          redirect("/sign-in?callbackUrl=/account");
        }
        setAuth(response.data.user);
      } catch {
        redirect("/sign-in?callbackUrl=/account");
      } finally {
        setLoading(false);
      }
    };
    fetchAuthData();
  }, []);

  if (loading || !auth) {
    //<SidebarSkeleton {...props} />
    return <LoadingPage loading={loading} text="Chargement..." />;
  }

  return (
    <Sidebar collapsible="icon" {...props} className={sidebarBg}>
      <SidebarHeader className={sidebarBg}>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      <SidebarSeparator className="bg-white/5 mx-3" />

      <SidebarContent className={sidebarBg}>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarSeparator className="bg-white/5 mx-3" />

      <SidebarFooter className={sidebarBg}>
        <NavUser user={auth} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

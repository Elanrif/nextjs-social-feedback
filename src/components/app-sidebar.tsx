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
import { ROUTES } from "@/utils/routes";

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
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

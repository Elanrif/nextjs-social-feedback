"use client";

import * as React from "react";
import { HomeIcon, Settings, User, Pencil, Lock } from "lucide-react";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { ROUTES } from "@/utils/routes";
import { NavMainUser } from "./nav-main-user";
import { AccountBrand } from "./features/account-brand";

const { MY_ACCOUNT, VIEW_PROFILE, EDIT_PROFILE, CHANGE_PASSWORD } = ROUTES;

const data = {
  navMain: [
    {
      title: "Accueil",
      url: MY_ACCOUNT,
      icon: HomeIcon,
    },
    {
      title: "Paramètres",
      url: "#",
      icon: Settings,
      isActive: true,
      items: [
        {
          title: "Voir le profil",
          url: VIEW_PROFILE,
          icon: User,
        },
        {
          title: "Modifier le profil",
          url: EDIT_PROFILE,
          icon: Pencil,
        },
        {
          title: "Mot de passe",
          url: CHANGE_PASSWORD,
          icon: Lock,
        },
      ],
    },
  ],
};

export function UserSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className="bg-white border-r border-gray-350">
      <SidebarHeader className="bg-white">
        <AccountBrand />
      </SidebarHeader>

      <SidebarSeparator className="bg-purple-300 mx-0" />

      <SidebarContent className="bg-white">
        <NavMainUser items={data.navMain} />
      </SidebarContent>

      <SidebarSeparator className="bg-purple-300 mx-0" />

      <SidebarFooter className="bg-white">
        <NavUser variant="light" />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

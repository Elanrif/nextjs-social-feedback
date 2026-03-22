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
import { redirect } from "next/navigation";
import { User as UserType } from "@/lib/users/models/user.model";
import { ROUTES } from "@/utils/routes";
import { NavMainUser } from "./nav-main-user";
import { authClient } from "@/lib/auth/api/auth.client";
import { AccountBrand } from "./features/account-brand";
import LoadingPage from "@components/features/loading-page";

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
  const [auth, setAuth] = React.useState<UserType | null>(null);
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
        <NavUser user={auth} variant="light" />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

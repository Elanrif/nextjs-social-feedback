"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LayoutDashboard,
  User as UserIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { User, UserRole } from "@/lib/users/models/user.model";
import { useSession } from "@/hooks/use.session";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/utils/routes";
import { SignOutButton } from "./features/auth/sign-out-button";

function getInitials(user: User) {
  return ((user.firstName?.slice(0, 1) ?? "") + (user.lastName?.slice(0, 1) ?? "")).toUpperCase();
}

function renderAccountMenuItem(user: User, pathname?: string | null) {
  if (!user) return null;
  if (pathname?.startsWith("/account") && user.role !== UserRole.ADMIN) return null;

  let target = user.role === UserRole.ADMIN ? ROUTES.DASHBOARD : ROUTES.MY_ACCOUNT;
  let label = user.role === UserRole.ADMIN ? "Admin dashboard" : "Mon espace";

  if (pathname?.startsWith("/dashboard")) {
    target = ROUTES.MY_ACCOUNT;
    label = "Mon profil";
  } else if (pathname?.startsWith("/account") && user.role === UserRole.ADMIN) {
    target = ROUTES.DASHBOARD;
    label = "Dashboard";
  }

  return (
    <DropdownMenuItem asChild>
      <Link href={target} className="flex items-center gap-2 cursor-pointer">
        {target === ROUTES.DASHBOARD ? (
          <LayoutDashboard className="w-4 h-4" />
        ) : (
          <UserIcon className="w-4 h-4" />
        )}
        {label}
      </Link>
    </DropdownMenuItem>
  );
}

export function NavUser({ user, variant = "dark" }: { user: User; variant?: "dark" | "light" }) {
  const { session, error, invalidate } = useSession();
  const { isMobile } = useSidebar();
  const pathname = usePathname();

  if (!user || !session) return null;

  const initials = getInitials(user);

  const isDark = variant === "dark";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={
                isDark
                  ? `h-12 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8
                    transition-all data-[state=open]:bg-white/10`
                  : `h-12 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200
                    transition-all data-[state=open]:bg-gray-100`
              }
            >
              <Avatar className="h-7 w-7 rounded-lg shrink-0">
                <AvatarImage src={user.avatar} alt={user.firstName} />
                <AvatarFallback
                  className={
                    isDark
                      ? "rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-semibold"
                      : "rounded-lg bg-indigo-100 text-indigo-600 text-xs font-semibold"
                  }
                >
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                <span
                  className={
                    isDark
                      ? "truncate text-xs font-semibold text-white/90"
                      : "truncate text-xs font-semibold text-gray-800"
                  }
                >
                  {user.firstName} {user.lastName}
                </span>
                <span
                  className={
                    isDark
                      ? "truncate text-[10px] text-white/40"
                      : "truncate text-[10px] text-gray-400"
                  }
                >
                  {user.email}
                </span>
              </div>
              <ChevronsUpDown
                className={
                  isDark
                    ? "ml-auto w-3.5 h-3.5 text-white/30 shrink-0"
                    : "ml-auto w-3.5 h-3.5 text-gray-400 shrink-0"
                }
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-60 rounded-xl border
              border-gray-100 shadow-xl"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            {/* User info header */}
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-3 py-3">
                <Avatar className="h-9 w-9 rounded-xl">
                  <AvatarImage src={user.avatar} alt={user.firstName} />
                  <AvatarFallback className="rounded-xl bg-emerald-100 text-emerald-700 text-sm
                    font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left leading-tight min-w-0">
                  <span className="truncate text-sm font-semibold text-gray-900">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="truncate text-xs text-gray-400">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>{renderAccountMenuItem(user, pathname)}</DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
                <BadgeCheck className="w-4 h-4 text-gray-400" />
                Compte
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
                <CreditCard className="w-4 h-4 text-gray-400" />
                Facturation
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
                <Bell className="w-4 h-4 text-gray-400" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="p-0" asChild>
              {session && !error && (
                <SignOutButton
                  variant="destructive"
                  className="w-full flex justify-center items-center rounded-lg"
                  onSignOut={invalidate}
                />
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

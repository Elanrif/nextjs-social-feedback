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
import Image from "next/image";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { UserRole } from "@/lib/users/models/user.model";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/utils/routes";
import { SignOutButton } from "./features/auth/sign-out-button";

function NavUserLoadingSkeleton({ variant }: { variant: "dark" | "light" }) {
  const isDark = variant === "dark";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          disabled
          aria-disabled
          className={
            isDark
              ? "h-12 rounded-xl bg-white/5 border border-white/8 transition-all"
              : "h-12 rounded-xl bg-gray-50 border border-gray-200 transition-all"
          }
        >
          <Skeleton
            className={
              isDark ? "h-7 w-7 rounded-lg bg-white/10" : "h-7 w-7 rounded-lg bg-slate-200"
            }
          />
          <div className="grid flex-1 text-left text-sm leading-tight min-w-0 gap-1">
            <Skeleton className={isDark ? "h-3 w-28 bg-white/10" : "h-3 w-28 bg-slate-200"} />
            <Skeleton className={isDark ? "h-2.5 w-36 bg-white/10" : "h-2.5 w-36 bg-slate-200"} />
          </div>
          <Skeleton
            className={isDark ? "ml-auto h-4 w-4 bg-white/10" : "ml-auto h-4 w-4 bg-slate-200"}
          />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function NavUser({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const { data: session, status } = useSession();
  const { isMobile } = useSidebar();
  const pathname = usePathname();

  if (status === "loading") return <NavUserLoadingSkeleton variant={variant} />;
  if (!session?.user) return null;

  const u = session.user;
  const initials = (
    (u.firstName?.slice(0, 1) ?? "") + (u.lastName?.slice(0, 1) ?? "")
  ).toUpperCase();
  const isDark = variant === "dark";

  function renderAccountMenuItem() {
    if (pathname?.startsWith("/account") && u.role !== UserRole.ADMIN) return null;

    let target = u.role === UserRole.ADMIN ? ROUTES.DASHBOARD : ROUTES.MY_ACCOUNT;
    let label = u.role === UserRole.ADMIN ? "Admin dashboard" : "Mon espace";

    if (pathname?.startsWith("/dashboard")) {
      target = ROUTES.MY_ACCOUNT;
      label = "Mon profil";
    } else if (pathname?.startsWith("/account") && u.role === UserRole.ADMIN) {
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
                <AvatarImage src={u.avatarUrl} alt={u.firstName} />
                <AvatarFallback
                  className={
                    isDark
                      ? "rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-semibold"
                      : "rounded-lg bg-indigo-100 text-indigo-600 text-xs font-semibold"
                  }
                >
                  {u.avatarUrl ? (
                    <Image
                      src={u.avatarUrl}
                      alt={`Avatar de ${u.firstName || u.email}`}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
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
                  {u.firstName} {u.lastName}
                </span>
                <span
                  className={
                    isDark
                      ? "truncate text-[10px] text-white/40"
                      : "truncate text-[10px] text-gray-400"
                  }
                >
                  {u.email}
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
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-3 py-3">
                <Avatar className="h-9 w-9 rounded-xl">
                  <AvatarImage src={u.avatarUrl} alt={u.firstName} />
                  <AvatarFallback className="rounded-xl bg-emerald-100 text-emerald-700 text-sm
                    font-semibold">
                    {u.avatarUrl ? (
                      <Image
                        src={u.avatarUrl}
                        alt={`Avatar de ${u.firstName || u.email}`}
                        width={80}
                        height={80}
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
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left leading-tight min-w-0">
                  <span className="truncate text-sm font-semibold text-gray-900">
                    {u.firstName} {u.lastName}
                  </span>
                  <span className="truncate text-xs text-gray-400">{u.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>{renderAccountMenuItem()}</DropdownMenuGroup>

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
              <SignOutButton
                variant="destructive"
                className="w-full flex justify-center items-center rounded-lg"
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

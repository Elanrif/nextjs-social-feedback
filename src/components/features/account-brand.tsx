"use client";

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { ROUTES } from "@/utils/routes";
import { UserCircle2 } from "lucide-react";

export function AccountBrand() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          asChild
          className="h-14 px-3 hover:bg-gray-50 rounded-xl transition-colors"
        >
          <a href={ROUTES.HOME}>
            <div className="flex items-center gap-3 w-full min-w-0">
              {/* Icon */}
              <div className="relative shrink-0">
                <div
                  className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 flex
                    items-center justify-center shadow-sm shadow-indigo-200"
                >
                  <UserCircle2 className="w-4 h-4 text-white" />
                </div>
                <span
                  className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-indigo-400
                    ring-2 ring-white"
                />
              </div>
              {/* Text */}
              <div className="grid flex-1 text-left leading-tight min-w-0">
                <span className="truncate text-sm font-semibold text-gray-900">Mon espace</span>
                <span
                  className="truncate text-[10px] text-gray-400 uppercase tracking-wider
                    font-medium"
                >
                  Compte utilisateur
                </span>
              </div>
            </div>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

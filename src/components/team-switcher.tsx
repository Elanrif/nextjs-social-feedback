"use client";

import * as React from "react";
import { Zap } from "lucide-react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { ROUTES } from "@/utils/routes";

export function TeamSwitcher({
  teams,
  isDisplay = true,
}: {
  teams: {
    name: string;
    logo: React.ElementType;
    plan: string;
  }[];
  isDisplay?: boolean;
}) {
  const [activeTeam] = React.useState(teams[0]);

  if (!activeTeam) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          asChild
          className="h-14 px-3 hover:bg-white/5 rounded-xl transition-colors"
        >
          <a href={ROUTES.HOME}>
            <div className="flex items-center gap-3 w-full min-w-0">
              {/* Icon */}
              <div className="relative shrink-0">
                <div
                  className="w-8 h-8 rounded-lg bg-linear-to-br from-emerald-500 to-teal-600 flex
                    items-center justify-center shadow-lg shadow-emerald-900/40"
                >
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span
                  className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400
                    ring-2 ring-slate-950"
                />
              </div>
              {/* Text */}
              <div className="grid flex-1 text-left leading-tight min-w-0">
                <span className="truncate text-sm font-semibold text-white">{activeTeam.name}</span>
                <span
                  className="truncate text-[10px] text-white/35 uppercase tracking-wider
                    font-medium"
                >
                  {activeTeam.plan}
                </span>
              </div>
            </div>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { ROUTES } from "@/utils/routes";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      icon?: LucideIcon;
    }[];
  }[];
}) {
  const pathname = usePathname();
  const dashboardBase = ROUTES.DASHBOARD;

  const activeItems = items.map((item) => {
    if (item.url === dashboardBase && pathname === dashboardBase) {
      return { ...item, isActive: true };
    }
    if (item.url === "#" && pathname.startsWith(dashboardBase) && pathname !== dashboardBase) {
      return { ...item, isActive: true };
    }
    return { ...item, isActive: false };
  });

  return (
    <SidebarGroup className="px-3 py-3">
      <SidebarGroupLabel className="text-white/25 text-[10px] uppercase tracking-widest
        font-semibold px-1 mb-2">
        Navigation
      </SidebarGroupLabel>
      <SidebarMenu className="gap-1">
        {activeItems.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            {item.items && item.items.length > 0 ? (
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={cn(
                      "rounded-xl text-sm font-medium h-9 transition-all duration-150",
                      item.isActive
                        ? "bg-white/10 text-white"
                        : "text-white/50 hover:bg-white/5 hover:text-white/80",
                    )}
                  >
                    {item.icon && (
                      <item.icon
                        className={cn(
                          "w-4 h-4 shrink-0",
                          item.isActive ? "text-white" : "text-white/40",
                        )}
                      />
                    )}
                    <span>{item.title}</span>
                    <ChevronRight
                      className={cn(
                        `ml-auto w-3.5 h-3.5 transition-transform duration-200
                          group-data-[state=open]/collapsible:rotate-90`,
                        item.isActive ? "text-white/60" : "text-white/25",
                      )}
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub className="ml-4 border-l border-white/8 pl-3 mt-1 gap-0.5">
                    {(() => {
                      const bestMatch = item
                        .items!.map((i) => i.url)
                        .filter((url) => pathname === url || pathname.startsWith(url + "/"))
                        .toSorted((a, b) => b.length - a.length)[0];
                      return item.items!.map((subItem) => {
                        const isSubActive = subItem.url === bestMatch;
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              className={cn(
                                "rounded-lg h-8 text-xs font-medium transition-all duration-150",
                                isSubActive
                                  ? "bg-emerald-500/15 text-emerald-300" +
                                      " hover:bg-emerald-500/20 hover:text-white"
                                  : "text-white/45 hover:bg-white/5 hover:text-white/75",
                              )}
                            >
                              <Link href={subItem.url} className="flex items-center gap-2">
                                {subItem.icon && (
                                  <subItem.icon
                                    className={cn(
                                      "w-3.5 h-3.5 shrink-0",
                                      isSubActive ? "text-current!" : "text-white/40!",
                                    )}
                                  />
                                )}
                                <span>{subItem.title}</span>
                                {isSubActive && (
                                  <span
                                    className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400
                                    shrink-0"
                                  />
                                )}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      });
                    })()}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            ) : (
              <SidebarMenuItem>
                <Link href={item.url}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={cn(
                      "rounded-xl text-sm font-medium h-9 transition-all duration-150",
                      item.isActive
                        ? `bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/20
                          hover:text-white`
                        : "text-white/50 hover:bg-white/5 hover:text-white/80",
                    )}
                  >
                    {item.icon && (
                      <item.icon
                        className={cn(
                          "w-4 h-4 shrink-0",
                          item.isActive ? "text-emerald-400" : "text-white/35",
                        )}
                      />
                    )}
                    <span>{item.title}</span>
                    {item.isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    )}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )}
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

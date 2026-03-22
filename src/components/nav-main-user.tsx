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

export function NavMainUser({
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
  const accountBase = ROUTES.MY_ACCOUNT;

  const activeItems = items.map((item) => {
    if (item.url === accountBase && pathname === accountBase) {
      return { ...item, isActive: true };
    }
    if (item.url === "#" && pathname.startsWith(accountBase) && pathname !== accountBase) {
      return { ...item, isActive: true };
    }
    return { ...item, isActive: false };
  });

  return (
    <SidebarGroup className="px-3 py-3">
      <SidebarGroupLabel className="text-gray-400 text-[10px] uppercase tracking-widest
        font-semibold px-1 mb-2">
        Navigation
      </SidebarGroupLabel>
      <SidebarMenu className="gap-1">
        {activeItems.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.items && item.items.length > 0 ? true : item.isActive}
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
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700",
                    )}
                  >
                    {item.icon && (
                      <item.icon
                        className={cn(
                          "w-4 h-4 shrink-0",
                          item.isActive ? "text-indigo-500" : "text-gray-400",
                        )}
                      />
                    )}
                    <span>{item.title}</span>
                    <ChevronRight
                      className={cn(
                        `ml-auto w-3.5 h-3.5 transition-transform duration-200
                          group-data-[state=open]/collapsible:rotate-90`,
                        item.isActive ? "text-indigo-400" : "text-gray-300",
                      )}
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub className="ml-4 border-l border-gray-100 pl-3 mt-1 gap-0.5">
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
                                  ? "bg-indigo-50 text-indigo-600" +
                                      " hover:bg-indigo-100 hover:text-indigo-700"
                                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700",
                              )}
                            >
                              <Link href={subItem.url} className="flex items-center gap-2">
                                {subItem.icon && (
                                  <subItem.icon
                                    className={cn("w-3.5 h-3.5 shrink-0 text-current!")}
                                  />
                                )}
                                <span>{subItem.title}</span>
                                {isSubActive && (
                                  <span
                                    className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500
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
                        ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700",
                    )}
                  >
                    {item.icon && (
                      <item.icon
                        className={cn(
                          "w-4 h-4 shrink-0",
                          item.isActive ? "text-indigo-500" : "text-gray-400",
                        )}
                      />
                    )}
                    <span>{item.title}</span>
                    {item.isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
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

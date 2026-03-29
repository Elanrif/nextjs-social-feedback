import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Sparkles } from "lucide-react";
import { redirect } from "next/navigation";
import { DashboardBreadcrumb } from "@/components/features/dashboard/dashboard-breadcrumb";
import { auth } from "@/lib/auth/next-auth/auth";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/sign-in?callbackUrl=/dashboard");

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset
        className="bg-[#faf7f0]
          bg-[linear-gradient(rgba(139,115,85,0.08)_1px,transparent_1px),linear-gradient(to_right,rgba(139,115,85,0.08)_1px,transparent_1px)]
          bg-size-[32px_32px]"
      >
        <header
          className="flex h-14 shrink-0 items-center gap-2 px-4 border-b border-gray-100 bg-white
            shadow-xs transition-[width,height] ease-linear
            group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
        >
          <div className="flex flex-1 items-center gap-3">
            <SidebarTrigger
              className="-ml-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg
                transition-colors"
            />
            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-4 bg-gray-200"
            />
            <DashboardBreadcrumb />
          </div>

          <div className="flex items-center gap-2">
            <div
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50
                border border-emerald-100 text-emerald-700 text-xs font-medium"
            >
              <Sparkles className="w-3 h-3" />
              <span>Pro</span>
            </div>
            <button
              className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50
                hover:bg-gray-100 border border-gray-200 transition-colors"
            >
              <Bell className="w-4 h-4 text-gray-500" />
              <span
                className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500 ring-1
                  ring-white"
              />
            </button>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 mt-5 p-16 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

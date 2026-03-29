import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserSidebar } from "@/components/user-sidebar";
import { redirect } from "next/navigation";
import { Bell, Sparkles } from "lucide-react";
import { AccountBreadcrumb } from "@/components/features/account/account-breadcrumb";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/sign-in?callbackUrl=/account");

  return (
    <SidebarProvider>
      <UserSidebar />
      <SidebarInset className="bg-gray-50/50">
        <header
          className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-100 bg-white
            shadow-xs transition-[width,height] ease-linear
            group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
        >
          <div className="flex flex-1 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 text-gray-500 hover:text-gray-700" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4 bg-gray-200"
            />
            <AccountBreadcrumb />
          </div>

          <div className="flex items-center gap-2 px-4">
            <div
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-linear-to-r
                from-indigo-50 to-violet-50 border border-indigo-100 text-indigo-600 text-xs
                font-medium"
            >
              <Sparkles className="w-3 h-3" />
              <span>Pro</span>
            </div>
            <button
              className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gray-100
                hover:bg-gray-200 transition-colors"
            >
              <Bell className="w-4 h-4 text-gray-500" />
              <span
                className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500 ring-1
                  ring-white"
              />
            </button>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-16 pt-0 mt-5">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

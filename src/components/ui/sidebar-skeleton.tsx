import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@components/ui/sidebar";
import { Skeleton } from "@components/ui/skeleton";

export default function SidebarSkeleton({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props} className="px-6">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Skeleton className="h-8 w-8 rounded bg-slate-200" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24 bg-slate-200" />
            <Skeleton className="h-3 w-16 bg-slate-200" />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <div className="space-y-4 px-2">
          {/* Dashboard item skeleton */}
          <Skeleton className="h-9 w-full rounded-md bg-slate-200" />

          {/* Store group skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-9 w-full rounded-md bg-slate-200" />
            <div className="ml-4 space-y-2">
              <Skeleton className="h-8 w-32 rounded-md bg-slate-200" />
              <Skeleton className="h-8 w-32 rounded-md bg-slate-200" />
              <Skeleton className="h-8 w-32 rounded-md bg-slate-200" />
            </div>
          </div>

          {/* Projects skeleton */}
          <div className="space-y-2 pt-4">
            <Skeleton className="h-5 w-20 bg-slate-200" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-32 rounded-md bg-slate-200" />
            </div>
          </div>
        </div>
      </SidebarContent>
      <SidebarFooter className="mt-auto">
        <div className="flex items-center gap-2 px-4 py-2">
          <Skeleton className="h-8 w-8 rounded-full bg-slate-200" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24 bg-slate-200" />
            <Skeleton className="h-3 w-32 bg-slate-200" />
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

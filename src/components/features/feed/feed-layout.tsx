import { LeftSidebar } from "./left-sidebar";
import { RightSidebar } from "./right-sidebar";

interface FeedLayoutProps {
  children: React.ReactNode;
}

export function FeedLayout({ children }: FeedLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <LeftSidebar />
      <div className="flex flex-1 justify-center gap-6 px-4">
        <main className="w-full max-w-xl py-6">{children}</main>
        <RightSidebar />
      </div>
    </div>
  );
}

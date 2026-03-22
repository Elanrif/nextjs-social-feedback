import { ROUTES } from "@/utils/routes";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/utils";

export default function Logo({
  name = "Kickstart Next.js",
  url = ROUTES.HOME,
  className = "",
  variant = "light",
}: {
  name?: string;
  url?: string;
  className?: string;
  variant?: "light" | "dark";
}) {
  return (
    <Link
      href={url}
      className={cn(
        "flex items-center gap-2.5 group transition-transform hover:scale-105",
        className,
      )}
    >
      <div className="relative">
        <div
          className="w-8 h-8 bg-linear-to-br from-green-500 to-yellow-500 rounded-lg flex
            items-center justify-center shadow-lg"
        >
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div
          className="absolute -top-1 -right-1 w-3 h-3 bg-linear-to-br from-red-400 to-orange-500
            rounded-full animate-pulse"
        />
      </div>
      <span
        className={`text-sm font-bold tracking-tight ${
          variant === "dark" ? "text-gray-900" : "text-white"
        }`}
      >
        {name}
      </span>
    </Link>
  );
}

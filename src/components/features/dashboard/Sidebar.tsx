/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";
import { ROUTES } from "@/utils/routes";
import { useEffect, useState } from "react";
import { User } from "@/lib/users/models/user.model";
import { CrudApiError } from "@/lib/shared/helpers/crud-api-error";
import { authClient } from "@/lib/auth/api/auth.client";

const { HOME, DASHBOARD, PRODUCTS, CATEGORIES } = ROUTES;
const links = [
  { href: DASHBOARD, label: "Dashboard" },
  {
    href: `${DASHBOARD}${PRODUCTS}`,
    label: "Produits",
  },
  {
    href: `${DASHBOARD}${CATEGORIES}`,
    label: "Catégories",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userError, setUserError] = useState<CrudApiError | null>(null);

  useEffect(() => {
    setLoading(true);
    authClient
      .getCurrentUser()
      .then((res) => {
        if (res.ok) {
          setUserError(null);
          setUser(res.data.user);
        } else {
          setUserError(res.error);
          setUser(null);
        }
      })
      .finally(() => setLoading(false));

    return () => {
      setUser(null);
      setUserError(null);
    };
  }, []);

  if (loading) {
    return (
      <aside
        className="w-48 min-h-screen bg-linear-to-b from-emerald-600 to-teal-500 text-white flex
          items-center justify-center shadow-lg"
      >
        <span className="text-sm text-white/80">Loading...</span>
      </aside>
    );
  }

  if (userError) {
    return (
      <aside
        className="w-48 min-h-screen bg-linear-to-b from-emerald-600 to-teal-500 text-white flex
          items-center justify-center shadow-lg"
      >
        <span className="text-sm text-red-400">Failed to load session</span>
      </aside>
    );
  }

  return (
    <aside
      className="w-48 min-h-screen bg-linear-to-b from-emerald-600 to-teal-500 text-white flex
        flex-col shadow-lg"
    >
      {/* Logo & Infos utilisateur */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-emerald-700">
        <button
          onClick={() => router.push(HOME)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20
            transition-colors text-white font-semibold shadow"
        >
          <UserCircle className="h-5 w-5" />
          <span>{user?.firstName || "Admin"}</span>
        </button>
        <span className="ml-auto font-bold text-lg tracking-tight">
          {user?.lastName?.slice(0, 2)?.toUpperCase() || "AD"}
        </span>
      </div>
      {user?.email && (
        <div className="px-6 py-2 text-xs border-b bg-white text-muted-foreground
          border-emerald-700">
          <span>{user.email}</span>
        </div>
      )}
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const isActive =
            link.href === DASHBOARD ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link key={link.href} href={link.href} passHref className="flex flex-col space-y-5">
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start rounded-lg px-2 py-2 text-base font-medium
                transition-colors
                ${isActive ? "bg-white/90 text-emerald-700" : "hover:bg-white/50 text-white"}`}
              >
                {link.label}
              </Button>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto p-4 text-xs text-white/60">
        © {new Date().getFullYear()} Kickstart
      </div>
    </aside>
  );
}

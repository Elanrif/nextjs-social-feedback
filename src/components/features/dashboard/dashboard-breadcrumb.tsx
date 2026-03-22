"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ROUTES } from "@/utils/routes";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const { DASHBOARD } = ROUTES;

const SEGMENT_LABELS: Record<string, string> = {
  users: "Utilisateurs",
  categories: "Catégories",
  products: "Produits",
  create: "Créer",
  edit: "Modifier",
};

function getSegmentLabel(segment: string): string {
  return SEGMENT_LABELS[segment] ?? segment;
}

function isId(segment: string): boolean {
  return /^\d+$/.test(segment);
}

export function DashboardBreadcrumb() {
  const pathname = usePathname();

  // Strip /dashboard prefix and split
  const after = pathname.replace(DASHBOARD, "").replace(/^\//, "");
  const segments = after ? after.split("/").filter(Boolean) : [];

  // Build breadcrumb items: skip bare numeric IDs (show "Détails" instead)
  const crumbs: {
    label: string;
    href?: string;
  }[] = [];
  let href: string = DASHBOARD;

  for (const seg of segments) {
    href = `${href}/${seg}`;

    if (isId(seg)) {
      crumbs.push({ label: "Détails" });
    } else {
      crumbs.push({
        label: getSegmentLabel(seg),
        href,
      });
    }
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <Link href={DASHBOARD} className="text-gray-400 hover:text-gray-600 transition-colors">
            <HomeIcon size={14} />
          </Link>
        </BreadcrumbItem>

        {crumbs.length === 0 ? (
          <>
            <BreadcrumbSeparator className="hidden md:block text-gray-300" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm font-medium text-gray-700">
                Dashboard
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : (
          crumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <BreadcrumbSeparator className="hidden md:block text-gray-300" />
              <BreadcrumbItem>
                {crumb.href && i < crumbs.length - 1 ? (
                  <Link
                    href={crumb.href}
                    className="text-gray-400 hover:text-gray-600 text-sm transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <BreadcrumbPage className="text-sm font-medium text-gray-700">
                    {crumb.label}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </span>
          ))
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

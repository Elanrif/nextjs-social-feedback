"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ROUTES } from "@/utils/routes";
import { UserCircle2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SEGMENT_LABELS: Record<string, string> = {
  profile: "Profil",
  edit: "Modifier",
  settings: "Paramètres",
  "change-password": "Mot de passe",
};

function getSegmentLabel(segment: string): string {
  return SEGMENT_LABELS[segment] ?? segment;
}

export function AccountBreadcrumb() {
  const pathname = usePathname();

  const after = pathname.replace(ROUTES.MY_ACCOUNT, "").replace(/^\//, "");
  const segments = after ? after.split("/").filter(Boolean) : [];

  const crumbs: {
    label: string;
    href?: string;
  }[] = [];
  let href: any = ROUTES.MY_ACCOUNT;

  for (const seg of segments) {
    href = `${href}/${seg}`;
    crumbs.push({
      label: getSegmentLabel(seg),
      href,
    });
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <Link
            href={ROUTES.MY_ACCOUNT}
            className="text-indigo-500/70 hover:text-indigo-700 transition-colors"
          >
            <UserCircle2 size={15} />
          </Link>
        </BreadcrumbItem>

        {crumbs.length === 0 ? (
          <>
            <BreadcrumbSeparator className="hidden md:block text-gray-300" />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium text-gray-700">Mon espace</BreadcrumbPage>
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
                    className="text-gray-400 hover:text-gray-700 text-sm transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <BreadcrumbPage className="font-medium text-gray-700 text-sm">
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

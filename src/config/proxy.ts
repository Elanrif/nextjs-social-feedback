import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth/jose";

const protectedRoutes = ["/dashboard", "/account"];
const publicRoutePrefixes = ["/sign-in", "/sign-up"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // normalize path (remove trailing slash except for root)
  const normalized = path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;

  const isProtectedRoute = protectedRoutes.some(
    (p) => normalized === p || normalized.startsWith(p + "/"),
  );
  const isPublicRoute = publicRoutePrefixes.some(
    (p) => normalized === p || normalized.startsWith(p + "/"),
  );

  // decrypt session from cookie (if any)
  const cookieStore = req.cookies.get("session")?.value;
  const session = await decrypt(cookieStore);

  // If route is protected and user is not authenticated => redirect to sign-in
  if (isProtectedRoute && !session?.user?.userId) {
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
  }

  // If user is admin => redirect to admin (but not if already on /admin)
  if (
    isProtectedRoute &&
    session?.user?.userId &&
    session?.user?.role === "ADMIN" &&
    !normalized.startsWith("/dashboard") &&
    !normalized.startsWith("/account")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  // If user is not admin => redirect to account (but not if already on /account)
  if (
    isProtectedRoute &&
    session?.user?.userId &&
    session?.user?.role !== "ADMIN" &&
    !normalized.startsWith("/account")
  ) {
    return NextResponse.redirect(new URL("/account", req.nextUrl));
  }

  // If route is public and user is authenticated => redirect to account/dashboard
  if (isPublicRoute && session?.user?.userId) {
    return NextResponse.redirect(new URL("/account", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  // eslint-disable-next-line unicorn/prefer-string-raw
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

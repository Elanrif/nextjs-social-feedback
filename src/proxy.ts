import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/account"];
const publicRoutePrefixes = ["/sign-in", "/sign-up"];

/**
 * Edge-compatible middleware using NextAuth v5.
 *
 * NextAuth stores the session in a signed JWT cookie — no DB call required
 * at the middleware level. Fine-grained RBAC (ADMIN → /dashboard,
 * USER → /account) is enforced by each layout via `getCurrentUser()`.
 */
export default auth(function middleware(req) {
  const path = req.nextUrl.pathname;
  const normalized = path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;

  const isProtectedRoute = protectedRoutes.some(
    (p) => normalized === p || normalized.startsWith(p + "/"),
  );
  const isPublicRoute = publicRoutePrefixes.some(
    (p) => normalized === p || normalized.startsWith(p + "/"),
  );

  const isAuthenticated = !!req.auth;

  // Not authenticated → redirect to sign-in
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
  }

  // Authenticated on a public route → send to account
  // (account layout will further redirect ADMIN to /dashboard)
  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/account", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  // eslint-disable-next-line unicorn/prefer-string-raw
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

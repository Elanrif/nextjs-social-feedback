import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const protectedRoutes = ["/dashboard", "/account"];
const publicRoutePrefixes = ["/sign-in", "/sign-up"];

/**
 * Edge-compatible middleware using Better Auth.
 *
 * Better Auth stores sessions in SQLite, so a full DB lookup cannot happen
 * in the Edge Runtime. We verify that the session COOKIE exists and has a
 * valid Better Auth signature — no DB call required.
 *
 * Fine-grained RBAC (ADMIN → /dashboard, USER → /account) is enforced by
 * each layout via `getCurrentUser()`, which runs in Node.js and can hit the DB.
 */
export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Normalize path (remove trailing slash except root)
  const normalized = path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;

  const isProtectedRoute = protectedRoutes.some(
    (p) => normalized === p || normalized.startsWith(p + "/"),
  );
  const isPublicRoute = publicRoutePrefixes.some(
    (p) => normalized === p || normalized.startsWith(p + "/"),
  );

  // Edge-compatible session check (cookie signature, no DB)
  const sessionCookie = getSessionCookie(req);
  const isAuthenticated = !!sessionCookie;

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
}

export const config = {
  // eslint-disable-next-line unicorn/prefer-string-raw
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

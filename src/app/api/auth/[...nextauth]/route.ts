import { handlers } from "@/lib/auth";

/**
 * NextAuth v5 catch-all route.
 * Handles all /api/auth/* requests:
 *   - POST /api/auth/callback/credentials  (sign-in)
 *   - POST /api/auth/signout               (sign-out)
 *   - GET  /api/auth/session               (session)
 */
export const { GET, POST } = handlers;

import { auth } from "@/lib/auth/better-auth/auth";
import { toNextJsHandler } from "better-auth/next-js";

/**
 * Better Auth catch-all route.
 * Handles all /api/auth/* requests including:
 *   - POST /api/auth/sign-in/backend   (custom backend credentials)
 *   - POST /api/auth/sign-up/backend   (custom backend registration)
 *   - POST /api/auth/sign-out
 *   - GET  /api/auth/get-session
 */
export const { GET, POST } = toNextJsHandler(auth);

"use client";

import { createAuthClient } from "better-auth/react";

/**
 * Better Auth React client.
 * Exposes useSession, signOut, and raw $fetch for custom endpoints.
 */
export const betterAuthClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL!,
});

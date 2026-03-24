"server-only";

import { keycloakProvider } from "./keycloak.provider";
import { restProvider } from "./rest.provider";
import type { AuthProvider } from "@/lib/auth/models/auth.model";

export type { AuthUser, AuthProvider } from "@/lib/auth/models/auth.model";

const PROVIDERS = {
  keycloak: keycloakProvider,
  rest: restProvider,
} as const satisfies Record<string, AuthProvider>;

type ProviderKey = keyof typeof PROVIDERS;

const key = (process.env.AUTH_PROVIDER ?? "rest") as ProviderKey;

if (!PROVIDERS[key]) {
  throw new Error(
    `Unknown AUTH_PROVIDER: "${key}". Valid values: ${Object.keys(PROVIDERS).join(", ")}`,
  );
}

/**
 * The active auth provider, selected via AUTH_PROVIDER env var.
 *
 * @example
 * AUTH_PROVIDER=keycloak   → Keycloak ROPC
 * AUTH_PROVIDER=rest        → External REST backend (default)
 */
export const authProvider: AuthProvider = PROVIDERS[key];

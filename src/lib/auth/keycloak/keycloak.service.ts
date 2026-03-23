"server-only";

import { kcConfig, kcAdminConfig, kcUrls } from "./keycloak.config";
import {
  CrudApiError,
  crudApiErrorResponse,
  Result,
} from "@/lib/shared/helpers/crud-api-error.server";
import { User, UserRole } from "@/lib/users/models/user.model";
import { Registrer } from "@/lib/auth/models/auth.model";
import { getLogger } from "@/config/logger.config";

const logger = getLogger("server");

// ─── Internal KC types ────────────────────────────────────────────────────────

type KcTokenClaims = {
  sub: string;
  email: string;
  given_name?: string;
  family_name?: string;
  phone_number?: string;
  realm_access?: { roles: string[] };
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Decode a JWT payload without verification.
 * Safe here because the token was just received directly from Keycloak over HTTPS.
 */
function decodeJwtPayload(token: string): KcTokenClaims {
  const payload = token.split(".")[1];
  return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
}

/**
 * Derive a stable numeric ID from the Keycloak UUID sub.
 * Used to satisfy the User.id: number contract without a backend DB.
 */
function hashSub(sub: string): number {
  let hash = 0;
  for (let i = 0; i < sub.length; i++) {
    hash = Math.trunc((hash << 5) - hash + (sub.codePointAt(i) ?? 0));
  }
  return Math.abs(hash);
}

function mapKcClaimsToUser(claims: KcTokenClaims): User {
  const roles = claims.realm_access?.roles ?? [];
  const role = roles.includes("ADMIN") ? UserRole.ADMIN : UserRole.USER;

  return {
    id: hashSub(claims.sub),
    email: claims.email ?? "",
    firstName: claims.given_name ?? "",
    lastName: claims.family_name ?? "",
    phoneNumber: claims.phone_number ?? "",
    password: "",
    avatarUrl: null,
    role,
    isActive: true,
    kcSub: claims.sub,
  };
}

// ─── Admin token ──────────────────────────────────────────────────────────────

async function getAdminToken(): Promise<string> {
  const res = await fetch(kcUrls.adminToken(), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "password",
      client_id: kcAdminConfig.clientId,
      username: kcAdminConfig.username,
      password: kcAdminConfig.password,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to obtain Keycloak admin token");
  }

  const { access_token } = await res.json();
  return access_token;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Sign in via Keycloak ROPC (Resource Owner Password Credentials).
 * Returns a mapped User built from the id_token claims.
 */
export async function kcSignIn(
  email: string,
  password: string,
): Promise<Result<User, CrudApiError>> {
  try {
    const res = await fetch(kcUrls.token(), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "password",
        username: email,
        password,
        client_id: kcConfig.clientId,
        client_secret: kcConfig.clientSecret,
        scope: "openid profile email",
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      logger.warn({ email, err }, "Keycloak sign-in failed");
      return {
        ok: false,
        error: {
          error: "Unauthorized",
          status: 401,
          message: err.error_description ?? "Email ou mot de passe incorrect",
        },
      };
    }

    const tokens = await res.json();
    const claims = decodeJwtPayload(tokens.id_token);
    const user = mapKcClaimsToUser(claims);

    logger.info({ email }, "Keycloak sign-in successful");
    return { ok: true, data: user };
  } catch (error) {
    logger.error({ err: error }, "Keycloak sign-in error");
    return { ok: false, error: crudApiErrorResponse(error, "kcSignIn") };
  }
}

/**
 * Register a new user via the Keycloak Admin REST API.
 * Uses admin credentials (master realm) to create the user in the app realm.
 */
export async function kcSignUp(data: Registrer): Promise<Result<void, CrudApiError>> {
  try {
    const adminToken = await getAdminToken();

    const res = await fetch(kcUrls.adminUsers(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        username: data.email,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        enabled: true,
        emailVerified: true,
        credentials: [{ type: "password", value: data.password, temporary: false }],
        attributes: {
          phoneNumber: [data.phoneNumber],
        },
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      logger.warn({ email: data.email, status: res.status, err }, "Keycloak sign-up failed");

      if (res.status === 409) {
        return {
          ok: false,
          error: {
            error: "Conflict",
            status: 409,
            message: "Un compte avec cet email existe déjà",
          },
        };
      }

      return {
        ok: false,
        error: {
          error: "Bad Request",
          status: res.status,
          message: err.errorMessage ?? "Erreur lors de l'inscription",
        },
      };
    }

    logger.info({ email: data.email }, "Keycloak user created");
    return { ok: true, data: undefined };
  } catch (error) {
    logger.error({ err: error }, "Keycloak sign-up error");
    return { ok: false, error: crudApiErrorResponse(error, "kcSignUp") };
  }
}

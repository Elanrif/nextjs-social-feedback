import "server-only";

import { cache } from "react";
import { auth } from "./auth";
import {
  CrudApiError,
  crudApiErrorResponse,
  Result,
} from "@/lib/shared/helpers/crud-api-error.server";
import { CurrentUser, Session } from "@/lib/auth/models/auth.model";
import { User, UserRole } from "@/lib/users/models/user.model";
import { getLogger } from "@/config/logger.config";

const logger = getLogger("server");

/**
 * Reads the current NextAuth session.
 * Returns a normalized Session object with all user fields from the Keycloak JWT.
 */
export const getSession = cache(async (): Promise<Result<Session, CrudApiError>> => {
  try {
    const session = await auth();

    if (!session?.user) {
      logger.warn("No active NextAuth session");
      return {
        ok: false,
        error: { error: "Unauthorized", status: 401, message: "No active session" },
      };
    }

    return {
      ok: true,
      data: {
        user: {
          userId: session.user.backendId,
          email: session.user.email ?? undefined,
          role: session.user.role ?? "USER",
          firstName: session.user.firstName,
          lastName: session.user.lastName,
          phoneNumber: session.user.phoneNumber,
          kcSub: session.user.kcSub,
        },
        isAuth: true,
        expiresAt: session.expires ? new Date(session.expires) : undefined,
      },
    };
  } catch (error) {
    logger.error({ err: error }, "Error retrieving NextAuth session");
    return { ok: false, error: crudApiErrorResponse(error) };
  }
});

/**
 * Returns the full User object.
 * With Keycloak, all user data is embedded in the JWT — no backend fetch needed.
 */
export const getCurrentUser = cache(async (): Promise<Result<CurrentUser, CrudApiError>> => {
  const session = await getSession();

  if (!session.ok || !session.data?.user) {
    logger.warn("getCurrentUser: no valid session");
    return {
      ok: false,
      error: { error: "Unauthorized", status: 401, message: "You must be logged in" },
    };
  }

  const { user: s } = session.data;

  const user: User = {
    id: s.userId ?? 0,
    email: s.email ?? "",
    firstName: s.firstName ?? "",
    lastName: s.lastName ?? "",
    phoneNumber: s.phoneNumber ?? "",
    password: "",
    avatarUrl: null,
    role: (s.role as UserRole) ?? UserRole.USER,
    isActive: true,
    kcSub: s.kcSub,
  };

  return { ok: true, data: { user, session: session.data } };
});

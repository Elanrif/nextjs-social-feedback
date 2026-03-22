import "server-only";

import { cache } from "react";
import { auth } from "./auth";
import { fetchUserById } from "@/lib/users/services/user.service";
import {
  CrudApiError,
  crudApiErrorResponse,
  Result,
} from "@/lib/shared/helpers/crud-api-error.server";
import { CurrentUser, Session } from "@/lib/auth/models/auth.model";
import { getLogger } from "@/config/logger.config";

const logger = getLogger("server");

/**
 * Reads the current NextAuth session.
 * Equivalent of the JOSE/BetterAuth getSession — returns a normalized Session object.
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
 * Returns the full User object from the external backend,
 * using the backendId stored in the NextAuth JWT.
 */
export const getCurrentUser = cache(async (): Promise<Result<CurrentUser, CrudApiError>> => {
  const session = await getSession();

  if (!session.ok || !session.data?.user?.userId) {
    logger.warn("getCurrentUser: no valid session");
    return {
      ok: false,
      error: { error: "Unauthorized", status: 401, message: "You must be logged in" },
    };
  }

  const response = await fetchUserById(session.data.user.userId, {});
  if (!response.ok) return { ok: false, error: response.error! };

  return { ok: true, data: { user: response.data, session: session.data } };
});

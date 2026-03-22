import "server-only";

import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "./auth";
import { getLogger } from "@/config/logger.config";
import { fetchUserById } from "@/lib/users/services/user.service";
import {
  CrudApiError,
  crudApiErrorResponse,
  Result,
} from "@/lib/shared/helpers/crud-api-error.server";
import { CurrentUser, Session } from "@/lib/auth/models/auth.model";

const logger = getLogger("server");

/**
 * Reads the current Better Auth session from the request headers.
 * Equivalent of the JOSE getSession — returns a normalized Session object.
 */
export const getSession = cache(async (): Promise<Result<Session, CrudApiError>> => {
  try {
    const reqHeaders = await headers();
    const baSession = await auth.api.getSession({ headers: reqHeaders });

    if (!baSession?.user) {
      logger.warn("No active Better Auth session");
      return {
        ok: false,
        error: { error: "Unauthorized", status: 401, message: "No active session" },
      };
    }

    const user = baSession.user as typeof baSession.user & { backendId?: number; role?: string };

    return {
      ok: true,
      data: {
        user: {
          userId: user.backendId ?? undefined,
          email: user.email,
          role: user.role ?? "USER",
        },
        isAuth: true,
        expiresAt: new Date(baSession.session.expiresAt),
      },
    };
  } catch (error) {
    logger.error({ err: error }, "Error retrieving Better Auth session");
    return { ok: false, error: crudApiErrorResponse(error) };
  }
});

/**
 * Returns the full User object from the external backend, using the
 * backendId stored in the BA session.
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

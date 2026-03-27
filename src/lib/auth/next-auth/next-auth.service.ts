import "server-only";

import { cache } from "react";
import { auth } from "./auth";
import { CurrentUser, AuthPayload } from "@/lib/auth/models/auth.model";
import { User, UserRole } from "@/lib/users/models/user.model";
import { getLogger } from "@/config/logger.config";
import { Result } from "@/shared/models/response.model";
import { ApiError } from "@/shared/errors/api-error";
import { ApiErrorResponse } from "@/shared/errors/api-error.server";

const logger = getLogger("server");

export const getSession = cache(async (): Promise<Result<AuthPayload, ApiError>> => {
  try {
    const session = await auth();

    if (!session?.user) {
      const errMsg = {
        title: "Unauthorized",
        status: 401,
        detail: "No active NextAuth session",
        errorCode: "Unauthorized",
        instance: undefined,
      } as ApiError;

      logger.warn("No active NextAuth session");
      return {
        ok: false,
        error: errMsg,
      };
    }

    return {
      ok: true,
      data: {
        access_token: session.user.access_token,
        refresh_token: session.user.refresh_token,
        user: {
          id: session.user.id ?? "",
          email: session.user.email ?? "",
          role: session.user.role ?? "USER",
          firstName: session.user.firstName,
          lastName: session.user.lastName,
          phoneNumber: session.user.phoneNumber,
        },
      },
    };
  } catch (error) {
    logger.error({ err: error }, "Error retrieving NextAuth session");
    return { ok: false, error: ApiErrorResponse(error) };
  }
});

export const getCurrentUser = cache(async (): Promise<Result<CurrentUser, ApiError>> => {
  const session = await getSession();

  if (!session.ok || !session.data?.user) {
    const errMsg = {
      title: "Unauthorized",
      status: 401,
      detail: "No active NextAuth session",
      errorCode: "Unauthorized",
      instance: undefined,
    } as ApiError;

    logger.warn("getCurrentUser: no valid session");
    return {
      ok: false,
      error: errMsg,
    };
  }

  const { user: s } = session.data;

  const user: User = {
    id: 0,
    email: s.email ?? "",
    firstName: s.firstName ?? "",
    lastName: s.lastName ?? "",
    phoneNumber: s.phoneNumber ?? "",
    password: "",
    avatarUrl: null,
    role: (s.role as UserRole) ?? UserRole.USER,
    isActive: true,
    externalId: s.id,
  };

  return { ok: true, data: { user, session: session.data } };
});

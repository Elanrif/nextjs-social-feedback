"server-only";

import apiClient from "@/config/api.config";
import environment from "@/config/environment.config";
import { crudApiErrorResponse } from "@/lib/shared/helpers/crud-api-error.server";
import type { CrudApiError, Result } from "@/lib/shared/helpers/crud-api-error.server";
import type { Registrer, AuthProvider, AuthUser } from "@/lib/auth/models/auth.model";
import type { AxiosResponse } from "axios";
import { getLogger } from "@/config/logger.config";

const logger = getLogger("server");

const {
  api: {
    rest: {
      endpoints: { kc_login: loginUrl, register: registerUrl },
    },
  },
} = environment;

/**
 * Raw shape returned by the backend /keycloak/login endpoint.
 * Internal to this provider — not exported.
 */
type AuthResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  refresh_expires_in?: number;
  token_type?: string;
  scope?: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string | null;
    role: string;
  };
};

export const restProvider: AuthProvider = {
  async signIn(email: string, password: string): Promise<Result<AuthUser, CrudApiError>> {
    try {
      const { data } = await apiClient(true).post<any, AxiosResponse<AuthResponse>>(loginUrl, {
        email,
        password,
      });

      const { access_token, refresh_token, expires_in, refresh_expires_in, user: u } = data;
      logger.info({ email }, "Backend sign-in successful");
      logger.debug({ accessToken: access_token }, "REST access_token (decode: jwt.io)");
      return {
        ok: true,
        data: {
          email: u.email,
          firstName: u.firstName,
          lastName: u.lastName,
          phoneNumber: u.phoneNumber ?? "",
          role: u.role,
          externalId: String(u.id),
          ...(access_token && { access_token, refresh_token, expires_in, refresh_expires_in }),
        },
      };
    } catch {
      logger.warn({ email }, "Backend sign-in failed");
      return {
        ok: false,
        error: {
          error: "Unauthorized",
          status: 401,
          message: "Email ou mot de passe incorrect",
        },
      };
    }
  },

  async signUp(data: Registrer): Promise<Result<void, CrudApiError>> {
    try {
      await apiClient(true).post(registerUrl, {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        confirmPassword: data.confirmPassword,
      });

      logger.info({ email: data.email }, "Backend sign-up successful");
      return { ok: true, data: undefined };
    } catch (error) {
      logger.warn({ email: data.email }, "Backend sign-up failed");
      return { ok: false, error: crudApiErrorResponse(error, "backendProvider.signUp") };
    }
  },
};

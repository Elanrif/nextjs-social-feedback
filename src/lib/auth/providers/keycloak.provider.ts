"server-only";

import { kcSignIn, kcSignUp } from "@/lib/auth/keycloak/keycloak.service";
import type { Registrer, AuthProvider, AuthPayload } from "@/lib/auth/models/auth.model";
import type { CrudApiError, Result } from "@/lib/shared/helpers/crud-api-error.server";

export const keycloakProvider: AuthProvider = {
  async signIn(email: string, password: string): Promise<Result<AuthPayload, CrudApiError>> {
    const result = await kcSignIn(email, password);
    if (!result.ok) return result;

    const { user: u, accessToken, refreshToken } = result.data;
    return {
      ok: true,
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: {
          id: u.kcSub ?? "",
          email: u.email,
          firstName: u.firstName,
          lastName: u.lastName,
          phoneNumber: u.phoneNumber,
          role: u.role,
        },
      },
    };
  },

  async signUp(data: Registrer): Promise<Result<AuthPayload, CrudApiError>> {
    const register = await kcSignUp(data);
    if (!register.ok) return register;
    return keycloakProvider.signIn(data.email, data.password);
  },
};

"server-only";

import { kcSignIn, kcSignUp } from "@/lib/auth/keycloak/keycloak.service";
import type { Registrer , AuthProvider, AuthUser } from "@/lib/auth/models/auth.model";
import type { CrudApiError, Result } from "@/lib/shared/helpers/crud-api-error.server";

export const keycloakProvider: AuthProvider = {
  async signIn(email: string, password: string): Promise<Result<AuthUser, CrudApiError>> {
    const result = await kcSignIn(email, password);
    if (!result.ok) return result;

    const { user: u, accessToken, refreshToken } = result.data;
    return {
      ok: true,
      data: {
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        phoneNumber: u.phoneNumber,
        role: u.role,
        externalId: u.kcSub,
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    };
  },

  async signUp(data: Registrer): Promise<Result<void, CrudApiError>> {
    return kcSignUp(data);
  },
};

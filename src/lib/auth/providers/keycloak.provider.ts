"server-only";

import { kcSignIn, kcSignUp } from "@/lib/auth/keycloak/keycloak.service";
import type { Registrer } from "@/lib/auth/models/auth.model";
import type { CrudApiError, Result } from "@/lib/shared/helpers/crud-api-error.server";
import type { AuthProvider, AuthUser } from "./provider.model";

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
        tokens: { accessToken, refreshToken },
      },
    };
  },

  async signUp(data: Registrer): Promise<Result<void, CrudApiError>> {
    return kcSignUp(data);
  },
};

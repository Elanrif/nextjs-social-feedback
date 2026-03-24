"server-only";

import type { AuthProvider, AuthPayload, Registrer } from "@/lib/auth/models/auth.model";
import type { CrudApiError, Result } from "@/lib/shared/helpers/crud-api-error.server";
import { signIn, signUp } from "@/lib/auth/auth.service";

export const restProvider: AuthProvider = {
  async signIn(email: string, password: string): Promise<Result<AuthPayload, CrudApiError>> {
    return signIn({ email, password });
  },

  async signUp(data: Registrer): Promise<Result<AuthPayload, CrudApiError>> {
    return signUp(data);
  },
};

"use client";

import { signInAction, signOutAction, signUpAction } from "@/lib/auth/actions/auth";
import { Registrer, Login } from "@lib/auth/models/auth.model";
import { CrudApiError } from "@/lib/shared/helpers/crud-api-error";

export const authClient = {
  signIn: {
    /**
     * Signs in via NextAuth Credentials provider (server action).
     * NextAuth sets the session cookie automatically.
     */
    email: async ({
      email,
      password,
    }: Pick<Login, "email" | "password">): Promise<
      Record<string, never> | { error: CrudApiError }
    > => {
      const result = await signInAction({ email, password });
      if ("error" in result) return { error: result as unknown as CrudApiError };
      return {};
    },

    social: async (_provider: string) => {
      // TODO: implement social sign-in
    },
  },

  signUp: async ({
    body,
  }: {
    body: Registrer;
  }): Promise<Record<string, never> | { error: CrudApiError }> => {
    const result = await signUpAction(body);
    if ("error" in result) return { error: result as unknown as CrudApiError };
    return {};
  },

  signOut: async () => {
    await signOutAction();
  },

  getCurrentUser: async () => {
    const res = await fetch("/api/auth/session/me", { credentials: "include" });
    return res.json();
  },
};

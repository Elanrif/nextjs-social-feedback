"use client";

import { betterAuthClient } from "@lib/auth/better-auth/auth.client";
import { signOutAction } from "@/lib/auth/actions/auth";
import { Registrer, Login } from "@lib/auth/models/auth.model";
import { CrudApiError } from "@/lib/shared/helpers/crud-api-error";

type SignInResult = { user: { role: string; email: string } } | { error: CrudApiError };
type SignUpResult = { user: { email: string } } | { error: CrudApiError };

export const authClient = {
  signIn: {
    /**
     * Calls the custom BA backend-credentials endpoint.
     * BA sets the session cookie + ba_role cookie automatically.
     */
    email: async ({
      email,
      password,
    }: Pick<Login, "email" | "password">): Promise<SignInResult> => {
      const { data, error } = await betterAuthClient.$fetch<{
        user: { role: string; email: string };
      }>("/api/auth/sign-in/backend", {
        method: "POST",
        body: { email, password },
      });

      if (error) {
        return {
          error: {
            error: "Unauthorized",
            status: error.status ?? 401,
            message: error.message ?? "Invalid credentials",
          },
        };
      }

      return { user: data!.user };
    },

    social: async (_provider: string) => {
      // TODO: implement social sign-in via BA social providers
    },
  },

  signUp: async ({ body }: { body: Registrer }): Promise<SignUpResult> => {
    const { data, error } = await betterAuthClient.$fetch<{ user: { email: string } }>(
      "/api/auth/sign-up/backend",
      {
        method: "POST",
        body,
      },
    );

    if (error) {
      return {
        error: {
          error: "UnprocessableEntity",
          status: error.status ?? 422,
          message: error.message ?? "Registration failed",
        },
      };
    }

    return { user: data!.user };
  },

  signOut: async () => {
    await signOutAction();
  },

  getCurrentUser: async () => {
    const { data, error } = await betterAuthClient.$fetch("/api/auth/session/me");
    if (error) return { ok: false, error };
    return { ok: true, data };
  },

  useSession: () => betterAuthClient.useSession(),
};

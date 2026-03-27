"use client";

import { signInAction, signUpAction, signOutAction } from "@/lib/auth/actions/auth";
import type { Login, Registrer } from "@/lib/auth/models/auth.model";

export const authClient = {
  signIn: {
    email: async (credentials: Pick<Login, "email" | "password">) => {
      return signInAction(credentials);
    },
  },

  signUp: async (body: Registrer) => {
    return signUpAction(body);
  },

  signOut: async (redirectTo?: string) => {
    await signOutAction();
    window.location.href = redirectTo ?? "/";
  },

  useSession: () => {
    // Utiliser useSession() de next-auth/react directement dans les composants
    throw new Error("Use useSession() from next-auth/react directly");
  },
};

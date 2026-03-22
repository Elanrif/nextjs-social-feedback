"server-only";

import * as authService from "@lib/auth/auth.service";
import * as baService from "@lib/auth/better-auth/better-auth.service";
import { Login, Registrer } from "@lib/auth/models/auth.model";
import { Config } from "@/config/api.config";
import { auth as baAuth } from "@/lib/auth/better-auth/auth";
import { headers } from "next/headers";

export const auth = {
  api: {
    signIn: async ({ body, config }: { body: Login; config?: Config }) => {
      return authService.signIn(body, config);
    },

    signUp: async ({ body, config }: { body: Registrer; config?: Config }) => {
      return authService.signUp(body, config);
    },

    signOut: async () => {
      await baAuth.api.signOut({ headers: await headers() });
    },

    getSession: async () => {
      return baService.getSession();
    },

    getCurrentUser: async () => {
      return baService.getCurrentUser();
    },

    verifyEmail: async ({ query }: { query: { token: string } }) => {
      // TODO: implement email verification
    },
  },
};

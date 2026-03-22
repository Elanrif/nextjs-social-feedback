"server-only";

import * as authService from "@lib/auth/auth.service";
import * as nextAuthService from "@lib/auth/next-auth/next-auth.service";
import { Login, Registrer } from "@lib/auth/models/auth.model";
import { Config } from "@/config/api.config";
import { signOut as nextAuthSignOut } from "@/lib/auth/next-auth/auth";

export const auth = {
  api: {
    signIn: async ({ body, config }: { body: Login; config?: Config }) => {
      return authService.signIn(body, config);
    },

    signUp: async ({ body, config }: { body: Registrer; config?: Config }) => {
      return authService.signUp(body, config);
    },

    signOut: async () => {
      await nextAuthSignOut({ redirect: false });
    },

    getSession: async () => {
      return nextAuthService.getSession();
    },

    getCurrentUser: async () => {
      return nextAuthService.getCurrentUser();
    },

    verifyEmail: async ({ query: _query }: { query: { token: string } }) => {
      // TODO: implement email verification
    },
  },
};

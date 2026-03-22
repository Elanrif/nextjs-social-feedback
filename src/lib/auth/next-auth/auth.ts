import "server-only";

import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getLogger } from "@/config/logger.config";
import apiClient from "@/config/api.config";
import environment from "@/config/environment.config";
import { User } from "@/lib/users/models/user.model";
import { AxiosResponse } from "axios";
import { LoginSchema } from "@/lib/auth/models/auth.model";

const logger = getLogger("server");

const {
  api: {
    rest: {
      endpoints: { login: loginUrl },
    },
  },
} = environment;

// ─── Type augmentation ───────────────────────────────────────────────────────

declare module "next-auth" {
  interface Session {
    user: {
      role: string;
      backendId: number;
      firstName: string;
      lastName: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    backendId: number;
    firstName: string;
    lastName: string;
  }
}

// ─── NextAuth config ──────────────────────────────────────────────────────────

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = LoginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        try {
          const { data: user } = await apiClient(true).post<any, AxiosResponse<User>>(loginUrl, {
            email: parsed.data.email,
            password: parsed.data.password,
          });

          return {
            id: String(user.id),
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            role: user.role,
            backendId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
          };
        } catch {
          logger.warn({ email: parsed.data.email }, "NextAuth credentials authorize failed");
          return null;
        }
      },
    }),
  ],

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.backendId = user.backendId;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
      }
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role as string;
      session.user.backendId = token.backendId as number;
      session.user.firstName = token.firstName as string;
      session.user.lastName = token.lastName as string;
      session.user.id = String(token.backendId);
      return session;
    },
  },

  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 jours
  },
});

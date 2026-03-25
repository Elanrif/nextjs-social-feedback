import "server-only";

import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getLogger } from "@/config/logger.config";
import { LoginSchema } from "@/lib/auth/models/auth.model";
import { signIn as restSignIn } from "@/lib/auth/auth.service";

const logger = getLogger("server");

// ─── Type augmentation ───────────────────────────────────────────────────────

declare module "next-auth" {
  interface Session {
    user: {
      role: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      access_token?: string;
      refresh_token?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    access_token?: string;
    refresh_token?: string;
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

        const result = await restSignIn({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (!result.ok) {
          logger.warn({ email: parsed.data.email }, "Auth provider signIn failed");
          return null;
        }

        const { user: u, access_token, refresh_token } = result.data;

        return {
          id: u.id,
          email: u.email,
          name: `${u.firstName} ${u.lastName}`,
          role: u.role,
          firstName: u.firstName,
          lastName: u.lastName,
          phoneNumber: u.phoneNumber,
          access_token,
          refresh_token,
        };
      },
    }),
  ],

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.phoneNumber = user.phoneNumber;
        token.access_token = user.access_token;
        token.refresh_token = user.refresh_token;
      }
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role as string;
      session.user.firstName = token.firstName as string;
      session.user.lastName = token.lastName as string;
      session.user.phoneNumber = token.phoneNumber as string;
      session.user.access_token = token.access_token as string | undefined;
      session.user.refresh_token = token.refresh_token as string | undefined;
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

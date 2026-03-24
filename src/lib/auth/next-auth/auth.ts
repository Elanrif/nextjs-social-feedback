import "server-only";

import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getLogger } from "@/config/logger.config";
import { LoginSchema } from "@/lib/auth/models/auth.model";
import { authProvider } from "@/lib/auth/providers";

const logger = getLogger("server");

// ─── Type augmentation ───────────────────────────────────────────────────────

declare module "next-auth" {
  interface Session {
    user: {
      role: string;
      externalId: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      access_token?: string;
      refresh_token?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    externalId: string;
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

        const result = await authProvider.signIn(parsed.data.email, parsed.data.password);
        if (!result.ok) {
          logger.warn({ email: parsed.data.email }, "Auth provider signIn failed");
          return null;
        }

        const user = result.data;

        return {
          id: user.externalId,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
          externalId: user.externalId,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          access_token: user.access_token,
          refresh_token: user.refresh_token,
        };
      },
    }),
  ],

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.externalId = user.externalId;
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
      session.user.externalId = token.externalId as string;
      session.user.firstName = token.firstName as string;
      session.user.lastName = token.lastName as string;
      session.user.phoneNumber = token.phoneNumber as string;
      session.user.id = token.externalId as string;
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

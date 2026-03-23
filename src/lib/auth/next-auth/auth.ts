import "server-only";

import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getLogger } from "@/config/logger.config";
import { LoginSchema } from "@/lib/auth/models/auth.model";
import { kcSignIn } from "@/lib/auth/keycloak/keycloak.service";

const logger = getLogger("server");

// ─── Type augmentation ───────────────────────────────────────────────────────

declare module "next-auth" {
  interface Session {
    user: {
      role: string;
      backendId: number;
      kcSub: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    backendId: number;
    kcSub: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
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

        const result = await kcSignIn(parsed.data.email, parsed.data.password);
        if (!result.ok) {
          logger.warn({ email: parsed.data.email }, "Keycloak authorize failed");
          return null;
        }

        const user = result.data;

        return {
          id: String(user.id),
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
          backendId: user.id,
          kcSub: user.kcSub,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
        };
      },
    }),
  ],

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.backendId = user.backendId;
        token.kcSub = user.kcSub;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.phoneNumber = user.phoneNumber;
      }
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role as string;
      session.user.backendId = token.backendId as number;
      session.user.kcSub = token.kcSub as string;
      session.user.firstName = token.firstName as string;
      session.user.lastName = token.lastName as string;
      session.user.phoneNumber = token.phoneNumber as string;
      session.user.id = token.kcSub as string;
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

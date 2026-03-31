import "server-only";

import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import moment from "moment";
import { getLogger } from "@/config/logger.config";
import { LoginSchema } from "@/lib/auth/models/auth.model";
import { signIn as restSignIn, refreshToken as restRefreshToken } from "@/lib/auth/auth.service";
import { isTokenExpired } from "@/config/auth.utils";

const logger = getLogger("server");

// ─── Type augmentation ───────────────────────────────────────────────────────

declare module "next-auth" {
  interface Session {
    user: {
      role: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      avatarUrl?: string;
      access_token?: string;
      refresh_token?: string;
    } & DefaultSession["user"];
    error?: "RefreshTokenError" | "RefreshTokenMissing" | "RefreshTokenExpired";
  }

  interface User {
    role: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    avatarUrl?: string;
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    refresh_expires_in?: number;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    refresh_expires_in?: number;
    accessTokenIssuedAt?: number;
    refreshTokenIssuedAt?: number;
    error?: "RefreshTokenError" | "RefreshTokenMissing" | "RefreshTokenExpired";
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

        const {
          user: u,
          access_token,
          refresh_token,
          expires_in,
          refresh_expires_in,
        } = result.data;

        return {
          id: u.id,
          email: u.email,
          name: `${u.firstName} ${u.lastName}`,
          role: u.role,
          firstName: u.firstName,
          lastName: u.lastName,
          phoneNumber: u.phoneNumber,
          avatarUrl: u.avatarUrl,
          access_token,
          refresh_token,
          expires_in,
          refresh_expires_in,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session) {
        return { ...token, ...session };
      }

      // Initial sign in — store token + issue timestamp
      if (user) {
        token.role = user.role;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.phoneNumber = user.phoneNumber;
        token.avatarUrl = user.avatarUrl;
        token.access_token = user.access_token;
        token.refresh_token = user.refresh_token;
        token.expires_in = user.expires_in;
        token.refresh_expires_in = user.refresh_expires_in;
        token.accessTokenIssuedAt = Date.now();
        token.refreshTokenIssuedAt = Date.now();
        token.error = undefined;
        return token;
      }

      // Check expiry and refresh if needed
      if (token.access_token && token.expires_in && token.accessTokenIssuedAt) {
        const expired = isTokenExpired(
          { access_token: token.access_token, expires_in: token.expires_in },
          moment(token.accessTokenIssuedAt),
        );
        if (!expired) return token;

        if (!token.refresh_token) {
          logger.warn("Access token expired but no refresh token available");
          return { ...token, error: "RefreshTokenMissing" as const };
        }

        // Check if the refresh token itself is expired (1800s = 30 min for Keycloak)
        if (token.refresh_expires_in && token.refreshTokenIssuedAt) {
          const refreshExpiry = moment(token.refreshTokenIssuedAt).add(
            token.refresh_expires_in,
            "seconds",
          );
          if (refreshExpiry.isSameOrBefore(moment())) {
            logger.warn("Refresh token expired, user must re-authenticate");
            return { ...token, error: "RefreshTokenExpired" as const };
          }
        }

        logger.info("Access token expired, attempting refresh...");
        const result = await restRefreshToken(token.refresh_token);
        if (!result.ok) {
          logger.error("Failed to refresh access token");
          return { ...token, error: "RefreshTokenError" as const };
        }

        const { access_token, refresh_token, expires_in, refresh_expires_in } = result.data;
        token.access_token = access_token;
        if (refresh_token) token.refresh_token = refresh_token;
        token.expires_in = expires_in;
        if (refresh_expires_in) token.refresh_expires_in = refresh_expires_in;
        token.accessTokenIssuedAt = Date.now();
        token.refreshTokenIssuedAt = Date.now();
        token.error = undefined;
        logger.info("Access token refreshed successfully");
      }

      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub ?? "";
      session.user.role = token.role as string;
      session.user.firstName = token.firstName as string;
      session.user.lastName = token.lastName as string;
      session.user.phoneNumber = token.phoneNumber as string;
      session.user.avatarUrl = token.avatarUrl as string | undefined;
      session.user.access_token = token.access_token as string | undefined;
      session.user.refresh_token = token.refresh_token as string | undefined;
      session.error = token.error;
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

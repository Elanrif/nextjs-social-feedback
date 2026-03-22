import "server-only";

import { APIError, betterAuth } from "better-auth";
import Database from "better-sqlite3";
import { z } from "zod";
import { getLogger } from "@/config/logger.config";
import apiClient from "@/config/api.config";
import environment from "@/config/environment.config";
import { User } from "@/lib/users/models/user.model";
import { AxiosResponse } from "axios";
import { createAuthEndpoint } from "better-auth/api";

const logger = getLogger("server");

const {
  api: {
    rest: {
      endpoints: { login: loginUrl, register: registerUrl },
    },
  },
} = environment;

const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

export const auth = betterAuth({
  database: new Database(process.env.DATABASE_URL ?? "./dev.db"),
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,

  /**
   * Extend the BA user with role + the backend's numeric id.
   * These are synced from the external backend on every sign-in.
   */
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        input: false,
      },
      backendId: {
        type: "number",
        required: false,
        input: false,
      },
    },
  },

  plugins: [
    {
      id: "backend-credentials",
      endpoints: {
        /**
         * POST /api/auth/sign-in/backend
         * Verifies credentials against the external backend, syncs the user
         * into Better Auth's local DB, and creates a BA session + cookie.
         */
        signInWithBackend: createAuthEndpoint(
          "/sign-in/backend",
          {
            method: "POST",
            body: z.object({
              email: z.string().email(),
              password: z.string().min(1),
            }),
          },
          async (ctx) => {
            const { email, password } = ctx.body;

            // 1. Verify against external backend
            let backendUser: User;
            try {
              const { data } = await apiClient(true).post<any, AxiosResponse<User>>(loginUrl, {
                email,
                password,
              });
              backendUser = data;
            } catch {
              logger.warn({ email }, "Backend sign-in failed");
              throw new APIError("UNAUTHORIZED", { message: "Invalid email or password" });
            }

            // 2. Upsert user in BA's local DB
            const existing = await ctx.context.internalAdapter.findUserByEmail(email, {
              includeAccounts: false,
            });

            let baUserId: string;
            if (existing?.user) {
              baUserId = existing.user.id;
              await ctx.context.internalAdapter.updateUser(baUserId, {
                name: `${backendUser.firstName} ${backendUser.lastName}`,
                role: backendUser.role,
                backendId: backendUser.id,
              });
            } else {
              const newUser = await ctx.context.internalAdapter.createUser({
                email: backendUser.email,
                name: `${backendUser.firstName} ${backendUser.lastName}`,
                emailVerified: true,
                role: backendUser.role,
                backendId: backendUser.id,
              });
              baUserId = newUser.id;
            }

            // 3. Create BA session
            const session = await ctx.context.internalAdapter.createSession(baUserId);

            // 4. Set the BA session cookie
            await ctx.setSignedCookie(
              ctx.context.authCookies.sessionToken.name,
              session.token,
              ctx.context.secret,
              {
                httpOnly: true,
                secure: process.env.ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: SESSION_MAX_AGE,
              },
            );

            logger.info({ email, baUserId }, "Sign-in via backend credentials successful");

            return ctx.json({
              user: {
                id: baUserId,
                backendId: backendUser.id,
                email: backendUser.email,
                name: `${backendUser.firstName} ${backendUser.lastName}`,
                role: backendUser.role,
              },
              session: { id: session.id, expiresAt: session.expiresAt },
            });
          },
        ),

        /**
         * POST /api/auth/sign-up/backend
         * Registers via the external backend then immediately creates a BA session.
         */
        signUpWithBackend: createAuthEndpoint(
          "/sign-up/backend",
          {
            method: "POST",
            body: z.object({
              email: z.string().email(),
              password: z.string().min(6),
              firstName: z.string().min(1),
              lastName: z.string().min(1),
              phoneNumber: z.string().min(10),
              confirmPassword: z.string().min(6),
            }),
          },
          async (ctx) => {
            const { email, password, firstName, lastName, phoneNumber, confirmPassword } = ctx.body;

            // 1. Register via external backend
            try {
              await apiClient(true).post(registerUrl, {
                email,
                password,
                firstName,
                lastName,
                phoneNumber,
                confirmPassword,
              });
            } catch {
              logger.warn({ email }, "Backend sign-up failed");
              throw new APIError("UNPROCESSABLE_ENTITY", {
                message: "Registration failed. Email may already be in use.",
              });
            }

            // 2. Authenticate to get the full User object
            let backendUser: User;
            try {
              const { data } = await apiClient(true).post<any, AxiosResponse<User>>(loginUrl, {
                email,
                password,
              });
              backendUser = data;
            } catch {
              throw new APIError("INTERNAL_SERVER_ERROR", {
                message: "Registration succeeded but sign-in failed. Please sign in manually.",
              });
            }

            // 3. Create BA user + session
            const existing = await ctx.context.internalAdapter.findUserByEmail(email, {
              includeAccounts: false,
            });

            let baUserId: string;
            if (existing?.user) {
              baUserId = existing.user.id;
            } else {
              const newUser = await ctx.context.internalAdapter.createUser({
                email: backendUser.email,
                name: `${backendUser.firstName} ${backendUser.lastName}`,
                emailVerified: true,
                role: backendUser.role,
                backendId: backendUser.id,
              });
              baUserId = newUser.id;
            }

            const session = await ctx.context.internalAdapter.createSession(baUserId);

            await ctx.setSignedCookie(
              ctx.context.authCookies.sessionToken.name,
              session.token,
              ctx.context.secret,
              {
                httpOnly: true,
                secure: process.env.ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: SESSION_MAX_AGE,
              },
            );

            logger.info({ email, baUserId }, "Sign-up via backend credentials successful");

            return ctx.json({
              user: {
                id: baUserId,
                backendId: backendUser.id,
                email: backendUser.email,
                name: `${backendUser.firstName} ${backendUser.lastName}`,
                role: backendUser.role,
              },
              session: { id: session.id, expiresAt: session.expiresAt },
            });
          },
        ),
      },
    },
  ],
});

import { User } from "@/lib/users/models/user.model";
import { Token } from "@/config/auth.utils";
import type { CrudApiError, Result } from "@/lib/shared/helpers/crud-api-error.server";
import { z } from "zod";

export interface AuthSignIn {
  action?: "SIGN_IN" | "SIGN_UP";
}

export interface Registrer extends AuthSignIn {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface Login extends AuthSignIn {
  email: string;
  password: string;
}

// ─── Auth provider types ──────────────────────────────────────────────────────

/**
 * Normalized user returned by any auth provider.
 * User fields + optional token fields (flat, via Partial<Token>).
 */
export type AuthUser = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  externalId: string;
} & Partial<Token>;

/**
 * Contract every auth provider must implement — Keycloak, external backend, etc.
 * The session layer (NextAuth) calls these methods without knowing which provider is used.
 */
export interface AuthProvider {
  signIn(email: string, password: string): Promise<Result<AuthUser, CrudApiError>>;
  signUp(data: Registrer): Promise<Result<void, CrudApiError>>;
}

// ─── Session types ────────────────────────────────────────────────────────────

export type Session = Partial<Token> & {
  user: {
    email?: string;
    role?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    externalId?: string;
  };
  expiresAt?: Date;
};

export type CurrentUser = {
  user: User;
  session: Session;
};

// ─── Zod schemas ──────────────────────────────────────────────────────────────

const BaseSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
});

export const LoginSchema = BaseSchema.pick({
  email: true,
  password: true,
}).extend({
  action: z.enum(["SIGN_IN", "SIGN_UP"]).optional(),
});
export type LoginFormData = z.infer<typeof LoginSchema>;
export const parseLogin = LoginSchema.safeParse;

export const RegisterSchema = BaseSchema.extend({
  action: z.enum(["SIGN_IN", "SIGN_UP"]).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
export type RegisterFormData = z.infer<typeof RegisterSchema>;
export const parseRegister = RegisterSchema.safeParse;

export const ProfileUserSchema = BaseSchema.omit({
  password: true,
  confirmPassword: true,
});
export type ProfileUserFormData = z.infer<typeof ProfileUserSchema>;
export const parseProfileUser = ProfileUserSchema.safeParse;

export const ChangePasswordProfileSchema = BaseSchema.pick({
  email: true,
  confirmPassword: true,
})
  .extend({
    oldPassword: BaseSchema.shape.password,
    newPassword: BaseSchema.shape.password,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordProfileFormData = z.infer<typeof ChangePasswordProfileSchema>;
export const parseChangePasswordProfile = ChangePasswordProfileSchema.safeParse;

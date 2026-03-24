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

// ─── Auth payload ─────────────────────────────────────────────────────────────

/**
 * Single auth type — mirrors the backend response shape.
 * Used by providers (sign-in result) and the session layer.
 * Token fields are flat via Partial<Token>.
 */
export type AuthPayload = Partial<Token> & {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: string;
  };
};

/**
 * Contract every auth provider must implement.
 */
export interface AuthProvider {
  signIn(email: string, password: string): Promise<Result<AuthPayload, CrudApiError>>;
  signUp(data: Registrer): Promise<Result<AuthPayload, CrudApiError>>;
}

// ─── Current user ─────────────────────────────────────────────────────────────

export type CurrentUser = {
  user: User;
  session: AuthPayload;
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

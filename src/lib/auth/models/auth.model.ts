import { User } from "@/lib/users/models/user.model";
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

export interface SessionPayload {
  user: {
    userId: number;
    email: string;
    role: string;
  };
  expiresAt: Date;
  [key: string]: any;
}

/**
 * Type representing the result of session verification.
 */
export type Session = {
  user: {
    userId?: number;
    email?: string;
    role?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    kcSub?: string;
  };
  isAuth: boolean;
  expiresAt?: Date;
};

export type CurrentUser = {
  user: User;
  session: Session;
};

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

/**
 * Login and Register schema with validation
 * ⚠️ Never trust the client input
 * ❌ Someone can bypass the form
 * ✅ Protection against malicious bugs
 */

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

/**
 * Profile schema with validation
 * ⚠️ Never trust the client input
 * ❌ Someone can bypass the form
 * ✅ Protection against malicious bugs
 */
export const ProfileUserSchema = BaseSchema.omit({
  password: true,
  confirmPassword: true,
});
export type ProfileUserFormData = z.infer<typeof ProfileUserSchema>;
export const parseProfileUser = ProfileUserSchema.safeParse;

/**
 * Change password schema with validation
 * ⚠️ Never trust the client input
 * ❌ Someone can bypass the form
 * ✅ Protection against malicious bugs
 */
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

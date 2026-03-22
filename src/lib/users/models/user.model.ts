import { z } from "zod";

export interface UserLogin {
  token: string;
  refreshToken: string;
  user: User;
}

export type UserUpdate = Partial<User>;

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
  avatarUrl: string | null;
  role: UserRole;
  isActive: boolean;
  [key: string]: any; // Allow additional properties
}

export interface UserSearchFilter {
  email?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
}

export interface ResetPassword {
  code: string;
  resetToken: string;
  email: string;
  newPassword: string;
}

// Schéma de base sans refine
const UserBaseSchema = z.object({
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
 * Reset password schema with validation
 * ⚠️ Never trust the client input
 * ❌ Someone can bypass the form
 */
export const ResetPasswordSchema = UserBaseSchema.pick({
  email: true,
}).extend({
  newPassword: UserBaseSchema.shape.password,
  code: z.string().min(1, "Reset code is required"),
  resetToken: z.string().min(1, "Reset token is required"),
});
export type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;
export const parseResetPassword = ResetPasswordSchema.safeParse;

/**
 * User schema with password confirmation validation
 * ⚠️ Never trust the client input
 * ❌ Someone can bypass the form
 */
export const UserSchema = UserBaseSchema.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
export type UserFormData = z.infer<typeof UserSchema>;
export const parseUserCreate = UserSchema.safeParse;

export const UserUpdateSchema = UserBaseSchema.partial().refine(
  (data) => {
    if (data.password !== undefined || data.confirmPassword !== undefined) {
      // If either password field is provided, both must be valid and match
      if (
        typeof data.password === "string" &&
        typeof data.confirmPassword === "string" &&
        data.password.length >= 6 &&
        data.confirmPassword.length >= 6
      ) {
        return data.password === data.confirmPassword;
      }
      return false;
    }
    return true; // If no password fields are provided, it's valid
  },
  {
    message: "Passwords must match and be at least 6 characters",
    path: ["confirmPassword"],
  },
);
export type UserUpdateFormData = z.infer<typeof UserUpdateSchema>;
export const parseUserUpdate = UserUpdateSchema.safeParse;

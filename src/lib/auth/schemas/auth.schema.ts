import { z } from "zod";

/**
 * Base auth schema — shared validation rules
 * ⚠️ Never trust the client input
 * ❌ Someone can bypass the form
 */
const BaseSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(200, "First name must be at most 200 characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(200, "Last name must be at most 200 characters"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(50, "Phone number must be at most 50 digits"),
  email: z
    .email({ message: "Invalid email address" })
    .max(255, "Email must be at most 255 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(255, "Password must be at most 255 characters"),
  confirmPassword: z
    .string()
    .min(8, "Confirm password must be at least 8 characters")
    .max(255, "Confirm password must be at most 255 characters"),
});

/**
 * Login form schema
 */
export const LoginSchema = BaseSchema.pick({
  email: true,
  password: true,
}).extend({
  action: z.enum(["SIGN_IN", "SIGN_UP"]).optional(),
});
export type LoginFormData = z.infer<typeof LoginSchema>;
export const parseLogin = LoginSchema.safeParse;

/**
 * Register form schema with password confirmation validation
 */
export const RegisterSchema = BaseSchema.extend({
  action: z.enum(["SIGN_IN", "SIGN_UP"]).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
export type RegisterFormData = z.infer<typeof RegisterSchema>;
export const parseRegister = RegisterSchema.safeParse;

/**
 * Profile user update schema
 */
export const ProfileUserSchema = BaseSchema.omit({
  password: true,
  confirmPassword: true,
}).extend({
  avatarUrl: z
    .url({ message: "L'URL de l'avatar doit être valide" })
    .max(255, "Avatar URL must be at most 255 characters")
    .optional(),
});
export type ProfileUserFormData = z.infer<typeof ProfileUserSchema>;
export const parseProfileUser = ProfileUserSchema.safeParse;

/**
 * Change password profile schema
 */
export const ChangePasswordProfileSchema = z
  .object({
    email: z
      .email({ message: "Invalid email address" })
      .max(255, "Email must be at most 255 characters"),
    oldPassword: z
      .string()
      .min(1, "Old password is required")
      .max(50, "Old password must be at most 50 characters"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .max(50, "New password must be at most 50 characters"),
    confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type ChangePasswordProfileFormData = z.infer<typeof ChangePasswordProfileSchema>;
export const parseChangePasswordProfile = ChangePasswordProfileSchema.safeParse;

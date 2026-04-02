import { z } from "zod";

/**
 * Base user schema — shared validation rules
 * ⚠️ Never trust the client input
 * ❌ Someone can bypass the form
 */
const UserBaseSchema = z.object({
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
 * Reset password schema with validation
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
 * User creation schema with password confirmation validation
 */
export const UserSchema = UserBaseSchema.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
export type UserFormData = z.infer<typeof UserSchema>;
export const parseUserCreate = UserSchema.safeParse;

/**
 * User update schema — all fields optional with password validation
 */
export const UserUpdateSchema = UserBaseSchema.partial().refine(
  (data) => {
    if (data.password !== undefined || data.confirmPassword !== undefined) {
      if (
        typeof data.password === "string" &&
        typeof data.confirmPassword === "string" &&
        data.password.length >= 8 &&
        data.confirmPassword.length >= 8
      ) {
        return data.password === data.confirmPassword;
      }
      return false;
    }
    return true;
  },
  {
    message: "Passwords must match and be at least 8 characters",
    path: ["confirmPassword"],
  },
);
export type UserUpdateFormData = z.infer<typeof UserUpdateSchema>;
export const parseUserUpdate = UserUpdateSchema.safeParse;

"use server";

import {
  signUp as restSignUp,
  changePasswordProfile,
  editProfile,
  resetPassword,
} from "@/lib/auth/auth.service";
import {
  ChangePasswordProfileFormData,
  Login,
  parseChangePasswordProfile,
  ProfileUserFormData,
  Registrer,
} from "@/lib/auth/models/auth.model";
import { parseResetPassword, ResetPassword, User } from "@/lib/users/models/user.model";
import { sendPasswordResetEmail, generateResetToken } from "@/config/mail.config";
import { signIn, signOut } from "@/lib/auth/next-auth/auth";
import { AuthError } from "next-auth";
import { ApiErrorResponse } from "@/shared/errors/api-error.server";
import { ApiError } from "@/shared/errors/api-error";

/**
 * Server Action: Sign In via NextAuth Credentials provider.
 * Returns an empty object on success (session cookie is set by NextAuth).
 * Returns CrudApiError on failure.
 */
export async function signInAction(credentials: Login): Promise<Record<string, never> | ApiError> {
  try {
    await signIn("credentials", {
      email: credentials.email,
      password: credentials.password,
      redirect: false,
    });
    return {};
  } catch (error) {
    // Re-throw Next.js redirect errors so navigation works correctly.
    // Only catch real auth failures (wrong password, etc.).
    if (error instanceof AuthError) {
      return ApiErrorResponse(error, "signIn action");
    }
    throw error;
  }
}

/**
 * Server Action: Sign Up
 * Registers via Keycloak Admin API then creates a NextAuth session.
 */
export async function signUpAction(userData: Registrer): Promise<Record<string, never> | ApiError> {
  try {
    const res = await restSignUp(userData);
    if (!res.ok) return res.error;

    // Create NextAuth session after successful registration
    await signIn("credentials", {
      email: userData.email,
      password: userData.password,
      redirect: false,
    });

    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      return ApiErrorResponse(error, "signUp action");
    }
    throw error;
  }
}

/**
 * Server Action: Sign Out — invalidates the NextAuth session.
 */
export async function signOutAction() {
  await signOut({ redirect: false });
}

/**
 * Server Action: Edit Profile
 */
export async function editProfileAction(data: ProfileUserFormData): Promise<User | ApiError> {
  try {
    const res = await editProfile(data);
    if (!res.ok) return res.error;
    return res.data;
  } catch (error: any) {
    const errMsg = ApiErrorResponse(error, "editProfile action");
    return errMsg;
  }
}

/**
 * Server Action: Send Password Reset Email
 */
export async function sendPasswordResetAction(
  email: string,
): Promise<{ success: boolean; message: string } | ApiError> {
  try {
    if (!email || !email.includes("@")) {
      return {
        title: "Invalid email",
        status: 400,
        detail: "Please provide a valid email address",
        instance: undefined,
        errorCode: "INVALID_EMAIL",
      } as ApiError;
    }

    const { resetToken, code } = generateResetToken();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}&code=${code}&email=${encodeURIComponent(email)}`;

    const emailSent = await sendPasswordResetEmail(email, resetToken, resetUrl);

    if (!emailSent) {
      return {
        title: "Email service unavailable",
        status: 503,
        detail: "Failed to send reset email. Please try again later.",
        instance: undefined,
        errorCode: "EMAIL_SERVICE_UNAVAILABLE",
      } as ApiError;
    }

    return {
      success: true,
      message:
        "If an account exists with this email, you will receive password reset instructions.",
    };
  } catch (error: any) {
    const errMsg = ApiErrorResponse(error, "sendPasswordReset action");
    return errMsg;
  }
}

/**
 * Server Action: Reset Password via token
 */
export async function resetPasswordTokenAction(data: ResetPassword): Promise<User | ApiError> {
  const validation = parseResetPassword(data);
  if (!validation.success) {
    return {
      status: 400,
      detail: validation.error.message,
      title: "Bad Request",
      instance: undefined,
      errorCode: "VALIDATION_ERROR",
    } as ApiError;
  }

  try {
    const res = await resetPassword(data);
    if (!res.ok) return res.error;
    return res.data;
  } catch (error) {
    const errMsg = ApiErrorResponse(error, "error resetPassword action");
    return errMsg;
  }
}

/**
 * Server Action: Change Password for authenticated users
 */
export async function changePasswordProfileAction(
  data: ChangePasswordProfileFormData,
): Promise<User | ApiError> {
  const validation = parseChangePasswordProfile(data);
  if (!validation.success) {
    return {
      status: 400,
      detail: validation.error.message,
      title: "Bad Request",
      instance: undefined,
      errorCode: "VALIDATION_ERROR",
    } as ApiError;
  }

  try {
    const res = await changePasswordProfile(data);
    if (!res.ok) return res.error;
    return res.data;
  } catch (error) {
    const errMsg = ApiErrorResponse(error, "error changePasswordProfile action");
    return errMsg;
  }
}

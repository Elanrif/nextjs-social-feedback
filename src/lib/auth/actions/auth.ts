"use server";

import {
  changePasswordProfile,
  editProfile,
  resetPassword,
  signUp as serverSignUp,
} from "@/lib/auth/auth.service";
import { CrudApiError, crudApiErrorResponse } from "@/lib/shared/helpers/crud-api-error.server";
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

/**
 * Server Action: Sign In via NextAuth Credentials provider.
 * Returns an empty object on success (session cookie is set by NextAuth).
 * Returns CrudApiError on failure.
 */
export async function signInAction(
  credentials: Login,
): Promise<Record<string, never> | CrudApiError> {
  try {
    await signIn("credentials", {
      email: credentials.email,
      password: credentials.password,
      redirect: false,
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error: "UNAUTHORIZED",
        status: 401,
        message: "Email ou mot de passe incorrect",
      } as unknown as CrudApiError;
    }
    return crudApiErrorResponse(error, "signInAction");
  }
}

/**
 * Server Action: Sign Up
 * Registers via the external backend then creates a NextAuth session.
 */
export async function signUpAction(
  userData: Registrer,
): Promise<Record<string, never> | CrudApiError> {
  try {
    const res = await serverSignUp(userData);
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
      return {
        error: "UNAUTHORIZED",
        status: 401,
        message: "Inscription réussie mais connexion échouée. Veuillez vous connecter.",
      } as unknown as CrudApiError;
    }
    return crudApiErrorResponse(error, "signUpAction");
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
export async function editProfileAction(data: ProfileUserFormData): Promise<User | CrudApiError> {
  try {
    const res = await editProfile(data);
    if (!res.ok) return res.error;
    return res.data;
  } catch (error: any) {
    return crudApiErrorResponse(error, "editProfile action");
  }
}

/**
 * Server Action: Send Password Reset Email
 */
export async function sendPasswordResetAction(
  email: string,
): Promise<{ success: boolean; message: string } | CrudApiError> {
  try {
    if (!email || !email.includes("@")) {
      return {
        error: "Invalid email",
        status: 400,
        message: "Please provide a valid email address",
      } as CrudApiError;
    }

    const { resetToken, code } = generateResetToken();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}&code=${code}&email=${encodeURIComponent(email)}`;

    const emailSent = await sendPasswordResetEmail(email, resetToken, resetUrl);

    if (!emailSent) {
      return {
        error: "Email service unavailable",
        status: 503,
        message: "Failed to send reset email. Please try again later.",
      } as CrudApiError;
    }

    return {
      success: true,
      message:
        "If an account exists with this email, you will receive password reset instructions.",
    };
  } catch (error: any) {
    return crudApiErrorResponse(error, "sendPasswordReset action");
  }
}

/**
 * Server Action: Reset Password via token
 */
export async function resetPasswordTokenAction(data: ResetPassword): Promise<User | CrudApiError> {
  const validation = parseResetPassword(data);
  if (!validation.success) {
    return { status: 400, message: validation.error.message, error: "Bad Request" } as CrudApiError;
  }

  try {
    const res = await resetPassword(data);
    if (!res.ok) return res.error;
    return res.data;
  } catch (error) {
    return crudApiErrorResponse(error, "resetPassword action");
  }
}

/**
 * Server Action: Change Password for authenticated users
 */
export async function changePasswordProfileAction(
  data: ChangePasswordProfileFormData,
): Promise<User | CrudApiError> {
  const validation = parseChangePasswordProfile(data);
  if (!validation.success) {
    return { status: 400, message: validation.error.message, error: "Bad Request" } as CrudApiError;
  }

  try {
    const res = await changePasswordProfile(data);
    if (!res.ok) return res.error;
    return res.data;
  } catch (error) {
    return crudApiErrorResponse(error, "changePasswordProfile action");
  }
}

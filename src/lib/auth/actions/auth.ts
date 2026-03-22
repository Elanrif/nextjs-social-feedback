"use server";

import {
  changePasswordProfile,
  editProfile,
  resetPassword,
  signIn as serverSignIn,
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
import { auth } from "@/lib/auth/better-auth/auth";
import { headers, cookies } from "next/headers";

/**
 * Server Action: Sign In
 * Safely handles authentication on the server side
 */
export async function signInAction(credentials: Login): Promise<User | CrudApiError> {
  try {
    const res = await serverSignIn(credentials);
    if (!res.ok) return res.error;
    return res.data;
  } catch (error: any) {
    return crudApiErrorResponse(error, "signIn action");
  }
}

/**
 * Server Action: Sign Up
 * Safely handles user registration on the server side
 */
export async function signUpAction(userData: Registrer): Promise<User | CrudApiError> {
  try {
    const res = await serverSignUp(userData);
    if (!res.ok) return res.error;
    return res.data;
  } catch (error: any) {
    return crudApiErrorResponse(error, "signUp action");
  }
}

/**
 * Server Action: Edit Profile
 * Safely handles profile editing on the server side
 */
export async function editProfileAction(data: ProfileUserFormData): Promise<User | CrudApiError> {
  try {
    const res = await editProfile(data);

    if (!res.ok) {
      return res.error;
    }
    return res.data;
  } catch (error: any) {
    const errMsg = crudApiErrorResponse(error, "editProfile action");
    return errMsg;
  }
}

/**
 * Server Action: Send Password Reset Email
 * Generates token and sends reset email to user
 */
export async function sendPasswordResetAction(
  email: string,
): Promise<{ success: boolean; message: string } | CrudApiError> {
  try {
    // Check if email is valid
    if (!email || !email.includes("@")) {
      return {
        error: "Invalid email",
        status: 400,
        message: "Please provide a valid email address",
      } as CrudApiError;
    }

    // Generate reset token
    const { resetToken, code } = generateResetToken();

    // Build reset URL (adjust based on your domain)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}&code=${code}&email=${encodeURIComponent(email)}`;

    // Send email
    const emailSent = await sendPasswordResetEmail(email, resetToken, resetUrl);

    if (!emailSent) {
      return {
        error: "Email service unavailable",
        status: 503,
        message: "Failed to send reset email. Please try again later.",
      } as CrudApiError;
    }

    // Always return success message for security (don't reveal if email exists)
    return {
      success: true,
      message:
        "If an account exists with this email, you will receive password reset instructions.",
    };
  } catch (error: any) {
    const errMsg = crudApiErrorResponse(error, "sendPasswordReset action");
    return errMsg;
  }
}

/**
 * Server Action: Change Password
 * Safely handles password change on the server side
 * Requires current password for security
 */
export async function resetPasswordTokenAction(data: ResetPassword): Promise<User | CrudApiError> {
  const validation = parseResetPassword(data);
  if (!validation.success) {
    return {
      status: 400,
      message: validation.error.message,
      error: "Bad Request",
    } as CrudApiError;
  }

  try {
    const res = await resetPassword(data);

    if (!res.ok) {
      return res.error;
    }

    // Go to sign in page after successful password reset
    return res.data;
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "error resetPassword action");
    return errMsg;
  }
}

/**
 * Server Action: Change Password
 * Safely handles password change on the server side for authenticated users
 * Requires old password for security
 */
export async function changePasswordProfileAction(
  data: ChangePasswordProfileFormData,
): Promise<User | CrudApiError> {
  const validation = parseChangePasswordProfile(data);
  if (!validation.success) {
    return {
      status: 400,
      message: validation.error.message,
      error: "Bad Request",
    } as CrudApiError;
  }

  try {
    const res = await changePasswordProfile(data);

    if (!res.ok) {
      return res.error;
    }

    // Go to sign in page after successful password reset
    return res.data;
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "error changePasswordProfile action");
    return errMsg;
  }
}

/**
 * Sign out: invalidate Better Auth session and clear the role cookie.
 */
export async function signOutAction() {
  await auth.api.signOut({ headers: await headers() });
  const cookieStore = await cookies();
  cookieStore.delete("ba_role");
}

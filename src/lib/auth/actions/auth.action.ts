"use server";

import { revalidatePath } from "next/cache";
import {
  logout as restLogout,
  refreshToken as restRefreshToken,
  signUp as restSignUp,
  changePasswordProfile,
  editProfile,
  resetPassword,
} from "@/lib/auth/auth.service";
import {
  AuthPayload,
  ChangePasswordProfileFormData,
  Login,
  ProfileUserFormData,
  Registrer,
} from "@/lib/auth/models/auth.model";
import { ResetPassword } from "@/lib/users/models/user.model";
import { sendPasswordResetEmail, generateResetToken } from "@/config/mail.config";
import { signIn, signOut, auth } from "@/lib/auth";
import { ApiErrorResponse } from "@/shared/errors/api-error.server";
import { ApiError, unauthorizedApiError } from "@/shared/errors/api-error";

export async function signInAction(credentials: Login) {
  return await signIn("credentials", {
    email: credentials.email,
    password: credentials.password,
    redirect: false,
  });
}

/**
 * Server Action: Sign Up
 * Registers via Keycloak Admin API then creates a NextAuth session.
 */
export async function signUpAction(userData: Registrer) {
  const res = await restSignUp(userData);
  if (!res.ok) return res;

  await signIn("credentials", {
    email: userData.email,
    password: userData.password,
    redirect: false,
  });

  return res;
}

/**
 * Server Action: Refresh backend tokens using the refresh token.
 * Useful when backend access token expires.
 */
export async function refreshTokenAction(refresh_token?: string): Promise<AuthPayload | ApiError> {
  try {
    const session = await auth();
    if (!session?.user) return unauthorizedApiError();

    const rt = refresh_token ?? session.user.refresh_token;
    if (!rt) {
      return {
        title: "Bad Request",
        status: 400,
        detail: "Missing refresh token",
        instance: undefined,
        errorCode: "VALIDATION_ERROR",
      } as ApiError;
    }

    const res = await restRefreshToken(rt);
    if (!res.ok) return res.error;
    return res.data;
  } catch (error: any) {
    return ApiErrorResponse(error, "refreshToken action");
  }
}

/**
 * Server Action: Logout from backend (optional) + always clear NextAuth session.
 */
export async function signOutAction() {
  const session = await auth();

  // Best-effort backend logout (do not block local sign-out)
  if (session?.user?.refresh_token) {
    await restLogout({ refresh_token: session.user.refresh_token });
  }

  await signOut({ redirect: false });
}

/**
 * Server Action: Edit Profile
 */
export async function editProfileAction(data: ProfileUserFormData) {
  const result = await editProfile(data);
  if (result.ok) {
    revalidatePath("/account");
    revalidatePath("/dashboard");
  }
  return result;
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
export async function resetPasswordTokenAction(data: ResetPassword) {
  return resetPassword(data);
}

/**
 * Server Action: Change Password for authenticated users
 */
export async function changePasswordProfileAction(data: ChangePasswordProfileFormData) {
  const result = await changePasswordProfile(data);
  if (result.ok) {
    revalidatePath("/account");
    revalidatePath("/dashboard");
  }
  return result;
}

"server-only";

import apiClient, { Config } from "@config/api.config";
import environment from "@config/environment.config";
import { AxiosResponse } from "axios";
import { parseResetPassword, ResetPassword, User } from "@lib/users/models/user.model";
import { getLogger } from "@/config/logger.config";
import {
  AuthPayload,
  ChangePasswordProfileFormData,
  Login,
  parseChangePasswordProfile,
  parseLogin,
  parseProfileUser,
  parseRegister,
  ProfileUserFormData,
  RegisterFormData,
} from "@lib/auth/models/auth.model";
import { validateId } from "@/utils/utils.server";
import { ApiError, unauthorizedApiError, badRequestApiError } from "@/shared/errors/api-error";
import { Result } from "@/shared/models/response.model";
import { ApiErrorResponse } from "@/shared/errors/api-error.server";
import { auth } from "@/lib/auth";

/**
 * ⚠️ Never trust the client input
 * ❌ Someone can bypass the form
 * ✅ Protection against malicious bugs
 */
const {
  api: {
    rest: {
      endpoints: {
        auth: {
          editProfile: editProfileUrl,
          changeProfilePasswordUrl: changeProfilePasswordUrl,
          refreshTokenUrl,
          logoutUrl,
        },
        register: registerUrl,
        login: loginUrl,
        resetPassword: resetPasswordUrl,
      },
    },
  },
} = environment;
const logger = getLogger("server");

const missingTokenError = (detail: string): Result<never, ApiError> => {
  return {
    ok: false,
    error: {
      status: 400,
      detail,
      title: "Bad Request",
      instance: undefined,
      errorCode: "VALIDATION_ERROR",
    },
  };
};

/**
 * Sign in a user with email and password
 */
export async function signIn(login: Login): Promise<Result<AuthPayload, ApiError>> {
  /**
   * Validate input data
   */
  const parse = parseLogin(login);
  if (!parse.success) {
    logger.warn({ context: "editProfile" }, "Validation failed for profile update");
    return {
      ok: false,
      error: badRequestApiError(parse.error.message),
    };
  }

  try {
    const { data } = await apiClient(true).post<any, AxiosResponse<AuthPayload>>(loginUrl, login);
    logger.info({ access_token: data.access_token }, "Access token");
    return { ok: true, data };
  } catch (error) {
    logger.error({ email: login.email }, "Failed to sign in");
    return {
      ok: false,
      error: ApiErrorResponse(error, "signIn"),
    };
  }
}

/**
 * Register a new user with email and password
 */
export async function signUp(
  registration: RegisterFormData,
): Promise<Result<AuthPayload, ApiError>> {
  /**
   * Validate input data
   */
  const parse = parseRegister(registration);
  if (!parse.success) {
    logger.warn({ context: "editProfile" }, "Validation failed for profile update");
    return {
      ok: false,
      error: badRequestApiError(parse.error.message),
    };
  }
  try {
    const { data } = await apiClient(true).post<any, AxiosResponse<AuthPayload>>(
      registerUrl,
      registration,
    );
    logger.info({ access_token: data.access_token }, "Access token");
    return { ok: true, data };
  } catch (error) {
    logger.error({ email: registration.email }, "Failed to register user");
    return {
      ok: false,
      error: ApiErrorResponse(error, "signUp"),
    };
  }
}

/**
 * Refresh access token using a refresh token
 */
export async function refreshToken(refresh_token: string): Promise<Result<AuthPayload, ApiError>> {
  if (!refresh_token) return missingTokenError("Missing refresh token");

  try {
    // Backend validation expects `refreshToken` (camelCase) for Keycloak endpoints.
    // Keep `refresh_token` as fallback for backward compatibility.
    const body = { refreshToken: refresh_token, refresh_token };
    const { data } = await apiClient(true).post<any, AxiosResponse<AuthPayload>>(
      refreshTokenUrl,
      body,
    );
    logger.info("Token refreshed successfully");
    return { ok: true, data };
  } catch (error) {
    logger.error("Failed to refresh token");
    return {
      ok: false,
      error: ApiErrorResponse(error, "refreshToken"),
    };
  }
}

/**
 * Logout user from backend
 *
 * Depending on backend implementation, logout can be performed with:
 * - Authorization header (access token)
 * - or refresh token in the body
 */
export async function logout(
  params: { refresh_token?: string } = {},
): Promise<Result<Record<string, never>, ApiError>> {
  /**
   * Check user authentication
   */
  const session = await auth();
  if (!session?.user) {
    logger.warn({ context: "logout" }, "Not logged in");
    return { ok: false, error: unauthorizedApiError() };
  }
  const config: Config = { access_token: session.user.access_token };

  try {
    console.log("Logging out with params:", params);
    await apiClient(false, config).post(logoutUrl, params);
    logger.info("Logged out successfully");
    return { ok: true, data: {} };
  } catch (error) {
    logger.warn("Failed to logout");
    return {
      ok: false,
      error: ApiErrorResponse(error, "logout"),
    };
  }
}

// ──────────────────────────── Manage account ─────────────────────────────
export async function changeUserPassword(
  userId: number,
  oldPassword: string,
  newPassword: string,
): Promise<Result<User, ApiError>> {
  const idError = validateId(userId);
  if (idError) return idError;

  try {
    const body = {
      old_password: oldPassword,
      new_password: newPassword,
    };
    const url = `/${userId}`;
    const result = await apiClient(true) //
      .patch<any, AxiosResponse<User>>(url, body);
    logger.info({ userId }, "changeUserPassword");
    return { ok: true, data: result.data };
  } catch (error: any) {
    logger.error(
      {
        userId,
        err: error.response?.data ?? error,
      },
      "Error during changeUserPassword",
    );
    return {
      ok: false,
      error: ApiErrorResponse(error, "changeUserPassword"),
    };
  }
}

/**
 * Change password for a user
 */
export async function resetPassword(data: ResetPassword): Promise<Result<User, ApiError>> {
  /**
   * Validate input data
   */
  const parse = parseResetPassword(data);
  if (!parse.success) {
    logger.warn({ context: "resetPassword" }, "Validation failed for password reset");
    return {
      ok: false,
      error: badRequestApiError(parse.error.message),
    };
  }

  try {
    const res = await apiClient(true).patch<any, AxiosResponse<User>>(resetPasswordUrl, data);
    logger.info({ id: res.data.id }, "Password reset successfully");
    return { ok: true, data: res.data };
  } catch (error: any) {
    logger.error({ err: error.response?.data ?? error }, "Failed to reset password");
    return {
      ok: false,
      error: ApiErrorResponse(error, "resetPassword"),
    };
  }
}

/**
 * Edit user profile
 */
export async function editProfile(data: ProfileUserFormData): Promise<Result<User, ApiError>> {
  /**
   * Check user authentication (RBAC)
   */
  const session = await auth();
  if (!session?.user) {
    logger.warn(
      { context: "editProfile" },
      "Not logged in: only authenticated users can edit profile",
    );
    return { ok: false, error: unauthorizedApiError() };
  }

  const config: Config = { access_token: session.user.access_token };

  /**
   * Validate input data
   */
  const parse = parseProfileUser(data);
  if (!parse.success) {
    logger.warn({ context: "editProfile" }, "Validation failed for profile update");
    return {
      ok: false,
      error: badRequestApiError(parse.error.message),
    };
  }

  /**
   * Attempt to update via API
   */
  try {
    const res = await apiClient(false, config).patch<any, AxiosResponse<User>>(
      editProfileUrl,
      parse.data,
    );
    logger.info({ id: res.data.id }, "Profile updated successfully");
    return { ok: true, data: res.data };
  } catch (error: any) {
    logger.error({ err: error.response?.data ?? error }, "Failed to update profile");
    return {
      ok: false,
      error: ApiErrorResponse(error, "editProfile"),
    };
  }
}

/**
 * Change user profile password
 */
export async function changePasswordProfile(
  data: ChangePasswordProfileFormData,
): Promise<Result<User, ApiError>> {
  /**
   * Check user authentication (RBAC)
   */
  const session = await auth();
  if (!session?.user) {
    logger.warn(
      { context: "changePasswordProfile" },
      "Not logged in: only authenticated users can change password",
    );
    return { ok: false, error: unauthorizedApiError() };
  }

  const config: Config = { access_token: session.user.access_token };

  /**
   * Validate input data
   */
  const parse = parseChangePasswordProfile(data);
  if (!parse.success) {
    logger.warn({ context: "changePasswordProfile" }, "Validation failed for password change");
    return {
      ok: false,
      error: badRequestApiError(parse.error.message),
    };
  }

  /**
   * Attempt to update via API
   */
  try {
    const res = await apiClient(false, config).patch<any, AxiosResponse<User>>(
      changeProfilePasswordUrl,
      parse.data,
    );
    logger.info({ id: res.data.id }, "Profile password updated successfully");
    return { ok: true, data: res.data };
  } catch (error: any) {
    logger.error({ err: error.response?.data ?? error }, "Failed to update profile password");
    return {
      ok: false,
      error: ApiErrorResponse(error, "changePasswordProfile"),
    };
  }
}

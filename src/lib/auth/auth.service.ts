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
import { validateId, validationError } from "@/utils/utils.server";
import { ApiError } from "@/shared/errors/api-error";
import { Result } from "@/shared/models/response.model";
import { ApiErrorResponse } from "@/shared/errors/api-error.server";

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
export async function signIn(
  login: Login,
  config?: Config,
): Promise<Result<AuthPayload, ApiError>> {
  const validation = parseLogin(login);
  if (!validation.success) return validationError(validation.error.issues, "Invalid login data");

  try {
    const { data } = await apiClient(true, config).post<any, AxiosResponse<AuthPayload>>(
      loginUrl,
      login,
    );
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
  config?: Config,
): Promise<Result<AuthPayload, ApiError>> {
  const validation = parseRegister(registration);
  if (!validation.success)
    return validationError(validation.error.issues, "Invalid registration data");

  try {
    const { data } = await apiClient(true, config).post<any, AxiosResponse<AuthPayload>>(
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
export async function refreshToken(
  refresh_token: string,
  config?: Config,
): Promise<Result<AuthPayload, ApiError>> {
  if (!refresh_token) return missingTokenError("Missing refresh token");

  try {
    // Backend validation expects `refreshToken` (camelCase) for Keycloak endpoints.
    // Keep `refresh_token` as fallback for backward compatibility.
    const body = { refreshToken: refresh_token, refresh_token };
    const { data } = await apiClient(true, config).post<any, AxiosResponse<AuthPayload>>(
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
  config?: Config,
): Promise<Result<Record<string, never>, ApiError>> {
  try {
    const client = apiClient(false, config);
    await client.post(logoutUrl, params);
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
  config: Config,
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
    const result = await apiClient(true, config) //
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
export async function resetPassword(
  data: ResetPassword,
  config?: Config,
): Promise<Result<User, ApiError>> {
  const validation = parseResetPassword(data);
  if (!validation.success)
    return validationError(validation.error.issues, "Invalid reset password data");

  try {
    const res = await apiClient(true, config).patch<any, AxiosResponse<User>>(
      resetPasswordUrl,
      data,
    );
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
export async function editProfile(
  data: ProfileUserFormData,
  config?: Config,
): Promise<Result<User, ApiError>> {
  const validation = parseProfileUser(data);
  if (!validation.success) return validationError(validation.error.issues, "Invalid profile data");

  try {
    const res = await apiClient(false, config).patch<any, AxiosResponse<User>>(
      editProfileUrl,
      data,
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
  config?: Config,
): Promise<Result<User, ApiError>> {
  const validation = parseChangePasswordProfile(data);
  if (!validation.success) return validationError(validation.error.issues, "Invalid password data");

  try {
    const res = await apiClient(false, config).patch<any, AxiosResponse<User>>(
      changeProfilePasswordUrl,
      data,
    );
    logger.info({ id: res.data.id }, "Profile updated successfully");
    return { ok: true, data: res.data };
  } catch (error: any) {
    logger.error({ err: error.response?.data ?? error }, "Failed to update profile");
    return {
      ok: false,
      error: ApiErrorResponse(error, "changeProfilePassword"),
    };
  }
}

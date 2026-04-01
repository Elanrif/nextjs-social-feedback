"server-only";

import apiClient, { Config } from "@config/api.config";
import environment from "@config/environment.config";
import {
  parseUserCreate,
  parseUserUpdate,
  User,
  UserUpdateFormData,
  UserSearchFilter,
} from "@lib/users/models/user.model";
import { getLogger } from "@config/logger.config";
import { validateId } from "@/utils/utils.server";
import { Result } from "@/shared/models/response.model";
import { ApiError, forbiddenApiError, badRequestApiError } from "@/shared/errors/api-error";
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
      endpoints: { users: usersUrl },
    },
  },
} = environment;

const logger = getLogger("server");

export async function fetchAllUsers(): Promise<Result<User[], ApiError>> {
  try {
    const res = await apiClient(true).get<User[]>(usersUrl);
    logger.info({ count: res.data.length }, "Fetched users");
    return { ok: true, data: res.data };
  } catch (error) {
    logger.error({ context: "fetchAllUsers" }, "Error fetching users");
    return {
      ok: false,
      error: ApiErrorResponse(error, "fetchAllUsers"),
    };
  }
}

/**
 * Create a new user
 */
export async function createUser(user: Omit<User, "id">): Promise<Result<User, ApiError>> {
  /**
   * Check user authentication (RBAC)
   */
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    logger.warn({ context: "createUser" }, "Unauthorized: only ADMIN users can create new users");
    return {
      ok: false,
      error: forbiddenApiError("Only ADMIN users can create new users"),
    };
  }

  const config: Config = { access_token: session.user.access_token };

  /**
   * Validate input data
   */
  const parse = parseUserCreate(user);
  if (!parse.success) {
    logger.warn({ context: "createUser" }, "Validation failed for user creation");
    return {
      ok: false,
      error: badRequestApiError(parse.error.message),
    };
  }

  /**
   * Attempt to create via API
   */
  try {
    const res = await apiClient(false, config).post<User>(usersUrl, parse.data);
    logger.info({ id: res.data.id }, "User created successfully");
    return { ok: true, data: res.data };
  } catch (error) {
    // ✅ Email supprimé des logs (RGPD — PII)
    logger.error({ context: "createUser" }, "Failed to create user");
    return {
      ok: false,
      error: ApiErrorResponse(error, "createUser"),
    };
  }
}

export async function fetchUserById(id: number): Promise<Result<User, ApiError>> {
  const idError = validateId(id);
  if (idError) return idError;

  try {
    const res = await apiClient(true).get<User>(`${usersUrl}/${id}`);
    return { ok: true, data: res.data };
  } catch (error) {
    logger.error({ id }, "Failed to fetch user");
    return {
      ok: false,
      error: ApiErrorResponse(error, "fetchUserById"),
    };
  }
}

export async function searchUsersFilter(
  filters: UserSearchFilter,
): Promise<Result<User[], ApiError>> {
  const params = new URLSearchParams();
  if (filters.email) params.set("email", filters.email);
  if (filters.firstName) params.set("firstName", filters.firstName);
  if (filters.lastName) params.set("lastName", filters.lastName);
  if (filters.isActive !== undefined) params.set("isActive", String(filters.isActive));

  try {
    const res = await apiClient(true).get<User[]>(`${usersUrl}/search?${params.toString()}`);
    logger.info({ count: res.data.length, filters }, "Users search completed");
    return { ok: true, data: res.data };
  } catch (error) {
    logger.error({ filters }, "Failed to search users");
    return {
      ok: false,
      error: ApiErrorResponse(error, "searchUsersFilter"),
    };
  }
}

export async function updateUser(
  id: number,
  user: UserUpdateFormData,
): Promise<Result<User, ApiError>> {
  /**
   * Check user authentication (RBAC)
   */
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    logger.warn({ context: "updateUser" }, "Unauthorized: only ADMIN users can update users");
    return {
      ok: false,
      error: forbiddenApiError("Only ADMIN users can update users"),
    };
  }

  const config: Config = { access_token: session.user.access_token };

  /**
   * Validate input data
   */
  const idError = validateId(id);
  if (idError) return idError;

  const parse = parseUserUpdate(user);
  if (!parse.success) {
    logger.warn({ context: "updateUser" }, "Validation failed for user update");
    return {
      ok: false,
      error: badRequestApiError(parse.error.message),
    };
  }

  /**
   * Attempt to update via API
   */
  try {
    const res = await apiClient(false, config).patch<User>(`${usersUrl}/${id}`, parse.data);
    logger.info({ id }, "User updated successfully");
    return { ok: true, data: res.data };
  } catch (error) {
    logger.error({ id }, "Failed to update user");
    return {
      ok: false,
      error: ApiErrorResponse(error, "updateUser"),
    };
  }
}

/**
 * Delete a user
 */
export async function deleteUser(id: number): Promise<Result<{ success: boolean }, ApiError>> {
  /**
   * Check user authentication (RBAC)
   */
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    logger.warn({ context: "deleteUser" }, "Unauthorized: only ADMIN users can delete users");
    return {
      ok: false,
      error: forbiddenApiError("Only ADMIN users can delete users"),
    };
  }

  const config: Config = { access_token: session.user.access_token };

  /**
   * Validate input data
   */
  const idError = validateId(id);
  if (idError) return idError;

  /**
   * Attempt to delete via API
   */
  try {
    await apiClient(false, config).delete(`${usersUrl}/${id}`);
    logger.info({ id }, "User deleted successfully");
    return { ok: true, data: { success: true } };
  } catch (error) {
    logger.error({ id }, "Failed to delete user");
    return {
      ok: false,
      error: ApiErrorResponse(error, "deleteUser"),
    };
  }
}

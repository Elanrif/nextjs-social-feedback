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
import { crudApiErrorResponse } from "@/lib/errors/crud-api-error.server";
import { validateId, validationError } from "@/utils/utils.server";
import { CrudApiError, Result } from "@/lib/errors/crud-api-error";

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

export async function fetchAllUsers(config: Config): Promise<Result<User[], CrudApiError>> {
  try {
    const res = await apiClient(true, config).get<User[]>(usersUrl);
    logger.info({ count: res.data.length }, "Fetched users");
    return { ok: true, data: res.data };
  } catch (error) {
    logger.error({ context: "fetchAllUsers" }, "Error fetching users");
    return {
      ok: false,
      error: crudApiErrorResponse(error, "fetchAllUsers"),
    };
  }
}

/**
 * Create a new user
 */
export async function createUser(
  config: Config,
  user: Omit<User, "id">,
): Promise<Result<User, CrudApiError>> {
  const parse = parseUserCreate(user);
  if (!parse.success) return validationError(parse.error.issues, "Invalid user data");

  try {
    const res = await apiClient(true, config).post<User>(usersUrl, parse.data);
    logger.info({ id: res.data.id }, "User created successfully");
    return { ok: true, data: res.data };
  } catch (error) {
    // ✅ Email supprimé des logs (RGPD — PII)
    logger.error({ context: "createUser" }, "Failed to create user");
    return {
      ok: false,
      error: crudApiErrorResponse(error, "createUser"),
    };
  }
}

export async function fetchUserById(
  id: number,
  config: Config,
): Promise<Result<User, CrudApiError>> {
  const idError = validateId(id);
  if (idError) return idError;

  try {
    const res = await apiClient(true, config).get<User>(`${usersUrl}/${id}`);
    return { ok: true, data: res.data };
  } catch (error) {
    logger.error({ id }, "Failed to fetch user");
    return {
      ok: false,
      error: crudApiErrorResponse(error, "fetchUserById"),
    };
  }
}

export async function searchUsersFilter(
  filters: UserSearchFilter,
  config: Config,
): Promise<Result<User[], CrudApiError>> {
  const params = new URLSearchParams();
  if (filters.email) params.set("email", filters.email);
  if (filters.firstName) params.set("firstName", filters.firstName);
  if (filters.lastName) params.set("lastName", filters.lastName);
  if (filters.isActive !== undefined) params.set("isActive", String(filters.isActive));

  try {
    const res = await apiClient(true, config).get<User[]>(
      `${usersUrl}/search?${params.toString()}`,
    );
    logger.info({ count: res.data.length, filters }, "Users search completed");
    return { ok: true, data: res.data };
  } catch (error) {
    logger.error({ filters }, "Failed to search users");
    return {
      ok: false,
      error: crudApiErrorResponse(error, "searchUsersFilter"),
    };
  }
}

export async function updateUser(
  id: number,
  user: UserUpdateFormData,
  config: Config,
): Promise<Result<User, CrudApiError>> {
  const idError = validateId(id);
  if (idError) return idError;

  const parse = parseUserUpdate(user);
  if (!parse.success) return validationError(parse.error.issues, "Invalid user data");

  try {
    const res = await apiClient(true, config).patch<User>(`${usersUrl}/${id}`, parse.data);
    logger.info({ id }, "User updated successfully");
    return { ok: true, data: res.data };
  } catch (error) {
    logger.error({ id }, "Failed to update user");
    return {
      ok: false,
      error: crudApiErrorResponse(error, "updateUser"),
    };
  }
}

/**
 * Delete a user
 */
export async function deleteUser(
  id: number,
  config: Config,
): Promise<Result<{ success: boolean }, CrudApiError>> {
  const idError = validateId(id);
  if (idError) return idError;

  try {
    await apiClient(true, config).delete(`${usersUrl}/${id}`);
    logger.info({ id }, "User deleted successfully");
    return { ok: true, data: { success: true } };
  } catch (error) {
    logger.error({ id }, "Failed to delete user");
    return {
      ok: false,
      error: crudApiErrorResponse(error, "deleteUser"),
    };
  }
}

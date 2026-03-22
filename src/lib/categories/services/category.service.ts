"server-only";

import { AxiosResponse } from "axios";
import apiClient, { Config } from "@config/api.config";
import environment from "@config/environment.config";
import { getLogger } from "@config/logger.config";
import {
  CrudApiError,
  crudApiErrorResponse,
  Result,
} from "@/lib/shared/helpers/crud-api-error.server";
import {
  Category,
  CategoryCreate,
  CategoryUpdate,
  parseCategoryCreate,
  parseCategoryUpdate,
} from "@lib/categories/models/category.model";
import { validateId, validationError } from "@/utils/utils.server";

/**
 * ⚠️ Never trust the client input
 * ❌ Someone can bypass the form
 * ✅ Protection against malicious bugs
 */
const {
  api: {
    rest: {
      endpoints: { categories: CATEGORIES_URL },
    },
  },
} = environment;

const logger = getLogger("server");

/**
 * Fetch all categories
 */
export async function fetchCategories(config: Config): Promise<Result<Category[], CrudApiError>> {
  try {
    const res = await apiClient(true, config).get<unknown, AxiosResponse<Category[]>>(
      CATEGORIES_URL,
    );
    logger.debug({ count: res.data.length }, "Categories fetched");
    return { ok: true, data: res.data };
  } catch (error) {
    logger.error("Failed to fetch categories");
    return {
      ok: false,
      error: crudApiErrorResponse(error, "fetchCategories"),
    };
  }
}

/**
 * Fetch a single category by ID
 */
export async function fetchCategory(
  config: Config,
  id: number,
): Promise<Result<Category, CrudApiError>> {
  const idError = validateId(id);
  if (idError) return idError;

  try {
    const res = await apiClient(true, config).get<unknown, AxiosResponse<Category>>(
      `${CATEGORIES_URL}/${id}`,
    );
    return { ok: true, data: res.data };
  } catch (error) {
    logger.error({ id }, "Failed to fetch category");
    return {
      ok: false,
      error: crudApiErrorResponse(error, "fetchCategory"),
    };
  }
}

/**
 * Create a new category
 */
export async function createCategory(
  config: Config,
  category: CategoryCreate,
): Promise<Result<Category, CrudApiError>> {
  const parse = parseCategoryCreate(category);
  if (!parse.success) return validationError(parse.error.issues, "Invalid category data");

  try {
    const res = await apiClient(true, config).post<unknown, AxiosResponse<Category>>(
      CATEGORIES_URL,
      parse.data,
    );
    logger.info({ id: res.data.id, name: res.data.name }, "Category created successfully");
    return { ok: true, data: res.data };
  } catch (error) {
    logger.error({ categoryName: category.name }, "Failed to create category");
    return {
      ok: false,
      error: crudApiErrorResponse(error, "createCategory"),
    };
  }
}

/**
 * Update an existing category
 */
export async function updateCategory(
  config: Config,
  id: number,
  category: CategoryUpdate,
): Promise<Result<Category, CrudApiError>> {
  const idError = validateId(id);
  if (idError) return idError;

  const parse = parseCategoryUpdate(category);
  if (!parse.success) return validationError(parse.error.issues, "Invalid category data");

  try {
    const res = await apiClient(true, config).patch<unknown, AxiosResponse<Category>>(
      `${CATEGORIES_URL}/${id}`,
      parse.data,
    );
    logger.info({ id, name: res.data.name }, "Category updated successfully");
    return { ok: true, data: res.data };
  } catch (error) {
    logger.error({ id }, "Failed to update category");
    return {
      ok: false,
      error: crudApiErrorResponse(error, "updateCategory"),
    };
  }
}

/**
 * Delete a category
 */
export async function deleteCategory(
  config: Config,
  id: number,
): Promise<Result<{ success: boolean }, CrudApiError>> {
  const idError = validateId(id);
  if (idError) return idError;

  try {
    await apiClient(true, config).delete(`${CATEGORIES_URL}/${id}`);
    logger.info({ id }, "Category deleted successfully");
    return { ok: true, data: { success: true } };
  } catch (error) {
    logger.error({ id }, "Failed to delete category");
    return {
      ok: false,
      error: crudApiErrorResponse(error, "deleteCategory"),
    };
  }
}

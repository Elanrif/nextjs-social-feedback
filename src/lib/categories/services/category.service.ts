"server-only";

import { AxiosResponse } from "axios";
import apiClient, { Config } from "@config/api.config";
import environment from "@config/environment.config";
import { getLogger } from "@config/logger.config";
import {
  Category,
  CategoryCreate,
  CategoryUpdate,
  parseCategoryCreate,
  parseCategoryUpdate,
} from "@lib/categories/models/category.model";
import { validateId, validationError } from "@/utils/utils.server";
import { ApiError } from "@/shared/errors/api-error";
import { ApiErrorResponse } from "@/shared/errors/api-error.server";

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
export async function fetchCategories(config: Config): Promise<Category[] | ApiError> {
  try {
    const res = await apiClient(true, config).get<unknown, AxiosResponse<Category[]>>(
      CATEGORIES_URL,
    );
    logger.debug({ count: res.data.length }, "Categories fetched");
    return res.data;
  } catch (error) {
    logger.error("Failed to fetch categories");
    return ApiErrorResponse(error, "fetchCategories");
  }
}

/**
 * Fetch a single category by ID
 */
export async function fetchCategory(config: Config, id: number): Promise<Category | ApiError> {
  const idCheck = validateId(id);
  if (idCheck && !idCheck.ok) return idCheck.error;

  try {
    const res = await apiClient(true, config).get<unknown, AxiosResponse<Category>>(
      `${CATEGORIES_URL}/${id}`,
    );
    return res.data;
  } catch (error) {
    logger.error({ id }, "Failed to fetch category");
    return ApiErrorResponse(error, "fetchCategory");
  }
}

/**
 * Create a new category
 */
export async function createCategory(
  config: Config,
  category: CategoryCreate,
): Promise<Category | ApiError> {
  const parse = parseCategoryCreate(category);
  if (!parse.success) {
    const err = validationError(parse.error.issues, "Invalid category data");
    if (!err.ok) return err.error;
  }

  try {
    const res = await apiClient(false, config).post<unknown, AxiosResponse<Category>>(
      CATEGORIES_URL,
      parse.data,
    );
    logger.info({ id: res.data.id, name: res.data.name }, "Category created successfully");
    return res.data;
  } catch (error) {
    logger.error({ categoryName: category.name }, "Failed to create category");
    return ApiErrorResponse(error, "createCategory");
  }
}

/**
 * Update an existing category
 */
export async function updateCategory(
  config: Config,
  id: number,
  category: CategoryUpdate,
): Promise<Category | ApiError> {
  const idCheck = validateId(id);
  if (idCheck && !idCheck.ok) return idCheck.error;

  const parse = parseCategoryUpdate(category);
  if (!parse.success) {
    const err = validationError(parse.error.issues, "Invalid category data");
    if (!err.ok) return err.error;
  }

  try {
    const res = await apiClient(false, config).patch<unknown, AxiosResponse<Category>>(
      `${CATEGORIES_URL}/${id}`,
      parse.data,
    );
    logger.info({ id, name: res.data.name }, "Category updated successfully");
    return res.data;
  } catch (error) {
    logger.error({ id }, "Failed to update category");
    return ApiErrorResponse(error, "updateCategory");
  }
}

/**
 * Delete a category
 */
export async function deleteCategory(
  config: Config,
  id: number,
): Promise<{ success: boolean } | ApiError> {
  const idCheck = validateId(id);
  if (idCheck && !idCheck.ok) return idCheck.error;

  try {
    await apiClient(false, config).delete(`${CATEGORIES_URL}/${id}`);
    logger.info({ id }, "Category deleted successfully");
    return { success: true };
  } catch (error) {
    logger.error({ id }, "Failed to delete category");
    return ApiErrorResponse(error, "deleteCategory");
  }
}

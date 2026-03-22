import { AxiosResponse } from "axios";
import { frontendHttp } from "@config/axios/frontend-http.config";
import { proxyEnvironment } from "@config/proxy-api.config";
import { CrudApiError } from "@/lib/shared/helpers/crud-api-error";
import { Category, CategoryCreate, CategoryUpdate } from "@/lib/categories/models/category.model";

/**
 * ⚠️ NO Logging and error Handling is needed here as the proxy API routes will handle logging.
 * Category client service for handling category operations.
 * This service interacts with the proxy API endpoints for category management.
 *
 * ℹ️ Pattern: returns T | CrudApiError union instead of Result<T, E>.
 * Callers use the `isCrudError()` type guard to distinguish success from error.
 * Contrast with user/product services which use the Result<T, E> discriminated union.
 */

const {
  api: {
    endpoints: { categories: CATEGORIES_URL },
  },
} = proxyEnvironment;

/**
 * Fetch all categories (client-side)
 */
export async function fetchCategories(): Promise<Category[] | CrudApiError> {
  const res = await frontendHttp().get<unknown, AxiosResponse<Category[] | CrudApiError>>(
    CATEGORIES_URL,
  );
  return res.data;
}

/**
 * Fetch a single category by ID (client-side)
 */
export async function fetchCategory(id: number): Promise<Category | CrudApiError> {
  const res = await frontendHttp().get<unknown, AxiosResponse<Category | CrudApiError>>(
    `${CATEGORIES_URL}/${id}`,
  );
  return res.data;
}

/**
 * Create a new category (client-side)
 */
export async function createCategory(category: CategoryCreate): Promise<Category | CrudApiError> {
  const res = await frontendHttp().post<unknown, AxiosResponse<Category | CrudApiError>>(
    CATEGORIES_URL,
    category,
  );
  return res.data;
}

/**
 * Update an existing category (client-side)
 */
export async function updateCategory(
  id: number,
  category: CategoryUpdate,
): Promise<Category | CrudApiError> {
  const res = await frontendHttp().patch<unknown, AxiosResponse<Category | CrudApiError>>(
    `${CATEGORIES_URL}/${id}`,
    category,
  );
  return res.data;
}

/**
 * Delete a category (client-side)
 */
export async function deleteCategory(id: number): Promise<{ success: boolean } | CrudApiError> {
  const res = await frontendHttp().delete<
    unknown,
    AxiosResponse<{ success: boolean } | CrudApiError>
  >(`${CATEGORIES_URL}/${id}`);
  return res.data;
}

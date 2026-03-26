import { AxiosResponse } from "axios";
import { frontendHttp } from "@config/axios/frontend-http.config";
import { proxyEnvironment } from "@config/proxy-api.config";
import { Category, CategoryCreate, CategoryUpdate } from "@/lib/categories/models/category.model";
import { CrudApiError, Result } from "@/lib/errors/crud-api-error";

const {
  api: {
    endpoints: { categories: CATEGORIES_URL },
  },
} = proxyEnvironment;

/**
 * Fetch all categories (client-side)
 */
export async function fetchCategories(): Promise<Result<Category[], CrudApiError>> {
  const res = await frontendHttp().get<unknown, AxiosResponse<Result<Category[], CrudApiError>>>(
    CATEGORIES_URL,
  );
  return res.data;
}

/**
 * Fetch a single category by ID (client-side)
 */
export async function fetchCategory(id: number): Promise<Result<Category, CrudApiError>> {
  const res = await frontendHttp().get<unknown, AxiosResponse<Result<Category, CrudApiError>>>(
    `${CATEGORIES_URL}/${id}`,
  );
  return res.data;
}

/**
 * Create a new category (client-side)
 */
export async function createCategory(
  category: CategoryCreate,
): Promise<Result<Category, CrudApiError>> {
  const res = await frontendHttp().post<unknown, AxiosResponse<Result<Category, CrudApiError>>>(
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
): Promise<Result<Category, CrudApiError>> {
  const res = await frontendHttp().patch<unknown, AxiosResponse<Result<Category, CrudApiError>>>(
    `${CATEGORIES_URL}/${id}`,
    category,
  );
  return res.data;
}

/**
 * Delete a category (client-side)
 */
export async function deleteCategory(
  id: number,
): Promise<Result<{ success: boolean }, CrudApiError>> {
  const res = await frontendHttp().delete<
    unknown,
    AxiosResponse<Result<{ success: boolean }, CrudApiError>>
  >(`${CATEGORIES_URL}/${id}`);
  return res.data;
}

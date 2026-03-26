import { AxiosResponse } from "axios";
import { frontendHttp } from "@config/axios/frontend-http.config";
import { proxyEnvironment } from "@config/proxy-api.config";
import { Category, CategoryCreate, CategoryUpdate } from "@/lib/categories/models/category.model";
import { ApiError } from "@/shared/errors/api-error";

const {
  api: {
    endpoints: { categories: CATEGORIES_URL },
  },
} = proxyEnvironment;

/**
 * Fetch all categories (client-side)
 */
export async function fetchCategories(): Promise<Category[] | ApiError> {
  const res = await frontendHttp().get<unknown, AxiosResponse<Category[] | ApiError>>(
    CATEGORIES_URL,
  );
  return res.data;
}

/**
 * Fetch a single category by ID (client-side)
 */
export async function fetchCategory(id: number): Promise<Category | ApiError> {
  const res = await frontendHttp().get<unknown, AxiosResponse<Category | ApiError>>(
    `${CATEGORIES_URL}/${id}`,
  );
  return res.data;
}

/**
 * Create a new category (client-side)
 */
export async function createCategory(category: CategoryCreate): Promise<Category | ApiError> {
  const res = await frontendHttp().post<unknown, AxiosResponse<Category | ApiError>>(
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
): Promise<Category | ApiError> {
  const res = await frontendHttp().patch<unknown, AxiosResponse<Category | ApiError>>(
    `${CATEGORIES_URL}/${id}`,
    category,
  );
  return res.data;
}

/**
 * Delete a category (client-side)
 */
export async function deleteCategory(id: number): Promise<{ success: boolean } | ApiError> {
  const res = await frontendHttp().delete<unknown, AxiosResponse<{ success: boolean } | ApiError>>(
    `${CATEGORIES_URL}/${id}`,
  );
  return res.data;
}

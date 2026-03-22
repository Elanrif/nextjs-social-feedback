import { AxiosResponse } from "axios";
import { frontendHttp } from "@config/axios/frontend-http.config";
import { proxyEnvironment } from "@config/proxy-api.config";
import { CrudApiError, Result } from "@/lib/shared/helpers/crud-api-error";
import {
  Product,
  ProductCreate,
  ProductUpdate,
  ProductFiltersParams,
  PageProduct,
} from "@/lib/products/models/product.model";

function buildProductsUrl(baseUrl: string, filters?: ProductFiltersParams): string {
  if (!filters || Object.keys(filters).length === 0) return baseUrl;
  const params = new URLSearchParams();
  const entries: Array<[keyof ProductFiltersParams, string]> = [
    ["search", "search"],
    ["categoryId", "categoryId"],
    ["sortBy", "sortBy"],
  ];
  for (const [key, param] of entries) {
    if (filters[key] !== undefined) params.append(param, String(filters[key]));
  }
  if (filters.isActive !== undefined) params.append("isActive", String(filters.isActive));
  return `${baseUrl}?${params}`;
}

/**
 * ⚠️ NO Logging and error Handling is needed here as the proxy API routes will handle logging.
 * Auth client service for handling user authentication operations.
 * This service interacts with the proxy API endpoints for authentication.
 */

const {
  api: {
    endpoints: { products: PRODUCTS_URL },
  },
} = proxyEnvironment;

/**
 * Fetch all products with optional filters (client-side)
 */
export async function fetchProducts(
  filters?: ProductFiltersParams,
): Promise<Result<PageProduct<Product[]>, CrudApiError>> {
  const url = buildProductsUrl(PRODUCTS_URL, filters);

  const res = await frontendHttp().get<
    unknown,
    AxiosResponse<Result<PageProduct<Product[]>, CrudApiError>>
  >(url);
  return res.data;
}

/**
 * Fetch a single product by ID (client-side)
 */
export async function fetchProduct(id: number): Promise<Result<Product, CrudApiError>> {
  const res = await frontendHttp().get<unknown, AxiosResponse<Result<Product, CrudApiError>>>(
    `${PRODUCTS_URL}/${id}`,
  );
  return res.data;
}

/**
 * Create a new product (client-side)
 */
export async function createProduct(
  product: ProductCreate,
): Promise<Result<Product, CrudApiError>> {
  const res = await frontendHttp().post<unknown, AxiosResponse<Result<Product, CrudApiError>>>(
    PRODUCTS_URL,
    product,
  );
  // data is the type of AxiosResponse's data
  return res.data;
}

/**
 * Update an existing product (client-side)
 */
export async function updateProduct(
  id: number,
  product: ProductUpdate,
): Promise<Result<Product, CrudApiError>> {
  const res = await frontendHttp().patch<unknown, AxiosResponse<Result<Product, CrudApiError>>>(
    `${PRODUCTS_URL}/${id}`,
    product,
  );
  // data is the type of AxiosResponse's data
  return res.data;
}

/**
 * Delete a product (client-side)
 */
export async function deleteProduct(
  id: number,
): Promise<Result<{ success: boolean }, CrudApiError>> {
  const res = await frontendHttp().delete<
    unknown,
    AxiosResponse<Result<{ success: boolean }, CrudApiError>>
  >(`${PRODUCTS_URL}/${id}`);
  return res.data;
}

"server-only";

import { AxiosResponse } from "axios";
import apiClient, { Config } from "@config/api.config";
import environment from "@config/environment.config";
import { getLogger } from "@config/logger.config";
import {
  Product,
  ProductCreate,
  ProductUpdate,
  ProductFiltersParams,
  PageProduct,
  parseProductCreate,
  parseProductUpdate,
} from "@/lib/products/models/product.model";
import { validateId, validationError } from "@/utils/utils.server";
import { Result } from "@/shared/models/response.model";
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
      endpoints: { products: PRODUCTS_URL },
    },
  },
} = environment;

const logger = getLogger("server");

export function buildProductsUrl(baseUrl: string, filters?: ProductFiltersParams): string {
  if (!filters || Object.keys(filters).length === 0) {
    return baseUrl;
  }

  const params = new URLSearchParams();

  const filterEntries: Array<[keyof ProductFiltersParams, string]> = [
    ["search", "search"],
    ["categoryId", "categoryId"],
    ["sortBy", "sortBy"],
  ];

  for (const [key, param] of filterEntries) {
    if (filters[key] !== undefined) {
      params.append(param, String(filters[key]));
    }
  }

  if (filters.isActive !== undefined) {
    params.append("isActive", String(filters.isActive));
  }

  return `${baseUrl}?${params}`;
}

/**
 * Fetch all products with optional filters
 */
export async function fetchProducts(
  config: Config,
  filters?: ProductFiltersParams,
): Promise<Result<PageProduct<Product[]>, ApiError>> {
  try {
    const url = buildProductsUrl(PRODUCTS_URL, filters);

    const res = await apiClient(true, config).get<unknown, AxiosResponse<PageProduct<Product[]>>>(
      url,
    );

    logger.debug({ count: res.data?.content?.length || 0 }, "Products fetched");
    return { ok: true, data: res.data };
  } catch (error) {
    logger.error({ filters }, "Failed to fetch products");
    return {
      ok: false,
      error: ApiErrorResponse(error, "fetchProducts"),
    };
  }
}

/**
 * Fetch a single product by ID
 */
export async function fetchProductById(
  config: Config,
  id: number,
): Promise<Result<Product, ApiError>> {
  const idError = validateId(id);
  if (idError) return idError;

  try {
    const res = await apiClient(true, config).get<unknown, AxiosResponse<Product>>(
      `${PRODUCTS_URL}/${id}`,
    );

    return { ok: true, data: res.data };
  } catch (error) {
    logger.error({ id }, "Failed to fetch product");
    return {
      ok: false,
      error: ApiErrorResponse(error, "fetchProductById"),
    };
  }
}

/**
 * Create a new product
 */
export async function createProduct(
  config: Config,
  product: ProductCreate,
): Promise<Result<Product, ApiError>> {
  /**
   * ⚠️ Never trust the client input
   * ❌ Someone can bypass the form
   * ✅ Protection against malicious bugs
   */
  const parse = parseProductCreate(product);
  if (!parse.success) return validationError(parse.error.issues, "Invalid product data");

  try {
    const res = await apiClient(false, config).post<unknown, AxiosResponse<Product>>(
      PRODUCTS_URL,
      parse.data,
    );

    logger.info({ id: res.data.id, name: res.data.name }, "Product created successfully");
    return { ok: true, data: res.data };
  } catch (error) {
    logger.error({ productName: product.name }, "Failed to create product");
    return {
      ok: false,
      error: ApiErrorResponse(error, "createProduct"),
    };
  }
}

/**
 * Update an existing product
 */
export async function updateProduct(
  config: Config,
  id: number,
  product: ProductUpdate,
): Promise<Result<Product, ApiError>> {
  /**
   * ⚠️ Never trust the client input
   * ❌ Someone can bypass the form
   * ✅ Protection against malicious bugs
   */
  const idError = validateId(id);
  if (idError) return idError;

  const parse = parseProductUpdate(product);
  if (!parse.success) return validationError(parse.error.issues, "Invalid product data");

  try {
    const res = await apiClient(false, config).patch<unknown, AxiosResponse<Product>>(
      `${PRODUCTS_URL}/${id}`,
      parse.data,
    );

    logger.info({ id, name: res.data.name }, "Product updated successfully");
    return { ok: true, data: res.data };
  } catch (error) {
    logger.error({ id }, "Failed to update product");
    return {
      ok: false,
      error: ApiErrorResponse(error, "updateProduct"),
    };
  }
}

/**
 * Delete a product
 */
export async function deleteProduct(
  config: Config,
  id: number,
): Promise<Result<{ success: boolean }, ApiError>> {
  const idError = validateId(id);
  if (idError) return idError;

  try {
    await apiClient(false, config).delete(`${PRODUCTS_URL}/${id}`);
    logger.info({ id }, "Product deleted successfully");
    return { ok: true, data: { success: true } };
  } catch (error) {
    logger.error({ id }, "Failed to delete product");
    return {
      ok: false,
      error: ApiErrorResponse(error, "deleteProduct"),
    };
  }
}

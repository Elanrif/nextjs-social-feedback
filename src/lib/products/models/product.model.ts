/**
 * Product Model
 * Define the product data structure
 */
import { Category } from "@/lib/categories/models/category.model";
import { z } from "zod";

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  isActive: boolean;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

/**
 * Product creation payload
 */
export interface ProductCreate {
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  isActive: boolean;
  categoryId?: number;
}

/**
 * Product update payload (all fields optional)
 */
export type ProductUpdate = Partial<ProductCreate>;

/**
 * Product filters for listing
 */
export interface ProductFiltersParams {
  search?: string;
  categoryId?: number;
  isActive?: boolean;
  sortBy?: string;
}

/**
 * Paginated response for products
 */
export interface PageProduct<T> {
  content: T;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export const productSchema = z.object({
  name: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
  slug: z.string().min(2, "Le slug doit comporter au moins 2 caractères"),
  description: z.string().optional(),
  price: z.coerce.number().gt(0, "Le prix doit être supérieur à 0"),
  stock: z.coerce.number().min(0, "Le stock ne peut pas être négatif"),
  isActive: z.boolean().default(true),
  categoryId: z.coerce.number().min(1, "La catégorie est requise"),
});

export type ProductFormData = z.infer<typeof productSchema>;

const productUpdateSchema = productSchema.partial();
export const parseProductCreate = productSchema.safeParse.bind(productSchema);
export const parseProductUpdate = productUpdateSchema.safeParse.bind(productUpdateSchema);

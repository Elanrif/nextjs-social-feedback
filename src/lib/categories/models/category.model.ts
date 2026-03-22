/**
 * Category Model
 * Define the category data structure
 */

import { Product } from "@/lib/products/models/product.model";
import { z } from "zod";

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  products?: Product[];
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Category creation payload
 */
export interface CategoryCreate {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder?: number;
}

/**
 * Category update payload (all fields optional)
 */
export type CategoryUpdate = Partial<CategoryCreate>;

/**
 * Category filters for listing
 */
export interface CategoryFilters {
  search?: string;
  parent_id?: number;
  is_active?: boolean;
  page?: number;
  limit?: number;
}

export const categorySchema = z.object({
  name: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
  slug: z.string().min(2, "Le slug doit comporter au moins 2 caractères"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

const categoryUpdateSchema = categorySchema.partial();
export const parseCategoryCreate = categorySchema.safeParse.bind(categorySchema);
export const parseCategoryUpdate = categoryUpdateSchema.safeParse.bind(categoryUpdateSchema);

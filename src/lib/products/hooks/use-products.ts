"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchProducts,
  fetchProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/products/services/product.client.service";
import type {
  ProductCreate,
  ProductUpdate,
  ProductFiltersParams,
} from "@/lib/products/models/product.model";

// ─── Query keys ───────────────────────────────────────────────────────────────

export const productKeys = {
  all: ["products"] as const,
  list: (filters?: ProductFiltersParams) => [...productKeys.all, "list", filters ?? {}] as const,
  detail: (id: number) => [...productKeys.all, "detail", id] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

/** Liste des produits avec filtres optionnels */
export function useProducts(filters?: ProductFiltersParams) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: async () => {
      const res = await fetchProducts(filters);
      if (!res.ok) throw new Error(res.error.message);
      return res.data;
    },
  });
}

/** Un produit par ID */
export function useProduct(id: number) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      const res = await fetchProduct(id);
      if (!res.ok) throw new Error(res.error.message);
      return res.data;
    },
    enabled: !!id,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Créer un produit */
export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ProductCreate) => {
      const res = await createProduct(data);
      if (!res.ok) throw new Error(res.error.message);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productKeys.all,
      });
    },
  });
}

/** Modifier un produit */
export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ProductUpdate }) => {
      const res = await updateProduct(id, data);
      if (!res.ok) throw new Error(res.error.message);
      return res.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: productKeys.all,
      });
    },
  });
}

/** Supprimer un produit */
export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await deleteProduct(id);
      if (!res.ok) throw new Error(res.error.message);
      return res.data;
    },
    onSuccess: (_, id) => {
      queryClient.removeQueries({
        queryKey: productKeys.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: productKeys.all,
      });
    },
  });
}

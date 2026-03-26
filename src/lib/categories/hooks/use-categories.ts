"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCategories,
  fetchCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/categories/services/category.client.service";
import type { CategoryCreate, CategoryUpdate } from "@/lib/categories/models/category.model";
import { isApiError } from "@/shared/errors/api-error";

// ─── Query keys ───────────────────────────────────────────────────────────────

export const categoryKeys = {
  all: ["categories"] as const,
  list: () => [...categoryKeys.all, "list"] as const,
  detail: (id: number) => [...categoryKeys.all, "detail", id] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

/** Liste complète des catégories */
export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: async () => {
      const res = await fetchCategories();
      if (isApiError(res)) throw new Error(res.detail);
      return res;
    },
  });
}

/** Une catégorie par ID */
export function useCategory(id: number) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: async () => {
      const res = await fetchCategory(id);
      if (isApiError(res)) throw new Error(res.detail);
      return res;
    },
    enabled: !!id,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Créer une catégorie */
export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CategoryCreate) => {
      const res = await createCategory(data);
      if (isApiError(res)) throw new Error(res.detail);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoryKeys.list(),
      });
    },
  });
}

/** Modifier une catégorie */
export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: CategoryUpdate }) => {
      const res = await updateCategory(id, data);
      if (isApiError(res)) throw new Error(res.detail);
      return res;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: categoryKeys.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: categoryKeys.list(),
      });
    },
  });
}

/** Supprimer une catégorie */
export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await deleteCategory(id);
      if (isApiError(res)) throw new Error(res.detail);
      return res;
    },
    onSuccess: (_, id) => {
      queryClient.removeQueries({
        queryKey: categoryKeys.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: categoryKeys.list(),
      });
    },
  });
}

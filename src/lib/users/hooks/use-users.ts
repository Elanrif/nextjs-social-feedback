"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllUsers,
  fetchUserById,
  createUser,
  updateUser,
  deleteUser,
  searchUsersFilter,
} from "@/lib/users/services/user.client.service";
import type { UserSearchFilter } from "@/lib/users/models/user.model";

// ─── Query keys ───────────────────────────────────────────────────────────────

export const userKeys = {
  all: ["users"] as const,
  list: () => [...userKeys.all, "list"] as const,
  detail: (id: number) => [...userKeys.all, "detail", id] as const,
  search: (filters: UserSearchFilter) => [...userKeys.all, "search", filters] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

/** Liste complète des utilisateurs */
export function useUsers() {
  return useQuery({
    queryKey: userKeys.list(),
    queryFn: async () => {
      const res = await fetchAllUsers();
      if (!res.ok) throw new Error(res.error.message);
      return res.data;
    },
  });
}

/** Un utilisateur par ID */
export function useUser(id: number) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: async () => {
      const res = await fetchUserById(id);
      if (!res.ok) throw new Error(res.error.message);
      return res.data;
    },
    enabled: !!id,
  });
}

/** Recherche filtrée */
export function useSearchUsers(filters: UserSearchFilter) {
  return useQuery({
    queryKey: userKeys.search(filters),
    queryFn: async () => {
      const res = await searchUsersFilter(filters);
      if (!res.ok) throw new Error(res.error.message);
      return res.data;
    },
    enabled: Object.values(filters).some((v) => v !== undefined && v !== ""),
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Créer un utilisateur */
export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof createUser>[0]) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.list(),
      });
    },
  });
}

/** Modifier un utilisateur */
export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof updateUser>[1] }) =>
      updateUser(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: userKeys.list(),
      });
    },
  });
}

/** Supprimer un utilisateur */
export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await deleteUser(id);
      if (!res.ok) throw new Error(res.error.message);
      return res.data;
    },
    onSuccess: (_, id) => {
      queryClient.removeQueries({
        queryKey: userKeys.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: userKeys.list(),
      });
    },
  });
}

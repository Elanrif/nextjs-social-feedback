"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPostAction,
  updatePostAction,
  deletePostAction,
} from "@/lib/posts/actions/post.action";
import type { PostCreate, PostUpdate } from "@/lib/posts/models/post.model";
import { fetchPostById, fetchPosts } from "../services/post.client.service";
import type { PostFilters } from "../services/post.service";

// ─── Query keys ───────────────────────────────────────────────────────────────

export const postKeys = {
  all: ["posts"] as const,
  list: (filters?: PostFilters) => [...postKeys.all, "list", filters ?? {}] as const,
  detail: (id: number) => [...postKeys.all, "detail", id] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

/** Liste des posts */
export function usePosts(filters?: PostFilters) {
  return useQuery({
    queryKey: postKeys.list(filters),
    queryFn: async () => {
      const res = await fetchPosts(filters);
      if (!res.ok) throw new Error(res.error?.detail || "Failed to fetch posts");
      return res.data;
    },
  });
}

/** Un post par ID */
export function usePost(id: number) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: async () => {
      const res = await fetchPostById(id);
      if (!res.ok) throw new Error(res.error?.detail || "Failed to fetch post");
      return res.data;
    },
    enabled: !!id,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Créer un post */
export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: PostCreate) => {
      const res = await createPostAction(data);
      if (!res.ok) throw new Error(res.error?.detail || "Failed to create post");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: postKeys.all,
      });
    },
  });
}

/** Modifier un post */
export function useUpdatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: PostUpdate }) => {
      const res = await updatePostAction(id, data);
      if (!res.ok) throw new Error(res.error?.detail || "Failed to update post");
      return res.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: postKeys.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: postKeys.all,
      });
    },
  });
}

/** Supprimer un post */
export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await deletePostAction(id);
      if (!res.ok) throw new Error(res.error?.detail || "Failed to delete post");
      return res.data;
    },
    onSuccess: (_, id) => {
      queryClient.removeQueries({
        queryKey: postKeys.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: postKeys.all,
      });
    },
  });
}

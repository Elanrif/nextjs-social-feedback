"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCommentAction,
  updateCommentAction,
  deleteCommentAction,
} from "@/lib/comments/actions/comment.action";
import type { CommentCreate, CommentUpdate } from "@/lib/comments/models/comment.model";
import { fetchCommentById, fetchComments } from "../services/comment.client.service";
import { CommentFilters } from "../services/comment.service";

// ─── Query keys ───────────────────────────────────────────────────────────────

export const commentKeys = {
  all: ["comments"] as const,
  list: (filters?: CommentFilters) => [...commentKeys.all, "list", filters ?? {}] as const,
  detail: (id: number) => [...commentKeys.all, "detail", id] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

/** Liste des commentaires */
export function useComments(filters?: CommentFilters) {
  return useQuery({
    queryKey: commentKeys.list(filters),
    queryFn: async () => {
      const res = await fetchComments(filters);
      if (!res.ok) throw new Error(res.error?.detail || "Failed to fetch comments");
      return res.data;
    },
  });
}

/** Un commentaire par ID */
export function useComment(id: number) {
  return useQuery({
    queryKey: commentKeys.detail(id),
    queryFn: async () => {
      const res = await fetchCommentById(id);
      if (!res.ok) throw new Error(res.error?.detail || "Failed to fetch comment");
      return res.data;
    },
    enabled: !!id,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Créer un commentaire */
export function useCreateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CommentCreate) => {
      const res = await createCommentAction(data);
      if (!res.ok) throw new Error(res.error?.detail || "Failed to create comment");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.all,
      });
    },
  });
}

/** Modifier un commentaire */
export function useUpdateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: CommentUpdate }) => {
      const res = await updateCommentAction(id, data);
      if (!res.ok) throw new Error(res.error?.detail || "Failed to update comment");
      return res.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: commentKeys.all,
      });
    },
  });
}

/** Supprimer un commentaire */
export function useDeleteComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await deleteCommentAction(id);
      if (!res.ok) throw new Error(res.error?.detail || "Failed to delete comment");
      return res.data;
    },
    onSuccess: (_, id) => {
      queryClient.removeQueries({
        queryKey: commentKeys.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: commentKeys.all,
      });
    },
  });
}

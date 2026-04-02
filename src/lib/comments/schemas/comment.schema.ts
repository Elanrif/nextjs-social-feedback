import { z } from "zod";

/**
 * Comment creation/update schema
 * ⚠️ Never trust the client input
 * ❌ Someone can bypass the form
 */
export const commentSchema = z.object({
  content: z.string().min(1, "Le commentaire ne peut pas être vide"),
  postId: z.coerce.number().int().min(1, "Veuillez sélectionner un post"),
  authorId: z.number().int().min(1, "L'auteur est requis"),
});

export type CommentFormData = z.infer<typeof commentSchema>;

const commentUpdateSchema = commentSchema.partial();
export const parseCommentCreate = commentSchema.safeParse.bind(commentSchema);
export const parseCommentUpdate = commentUpdateSchema.safeParse.bind(commentUpdateSchema);

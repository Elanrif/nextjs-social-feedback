import { z } from "zod";

/**
 * Post creation/update schema
 * ⚠️ Never trust the client input
 * ❌ Someone can bypass the form
 */
export const postSchema = z.object({
  title: z.string().min(1, "Le titre ne peut pas être vide"),
  imageUrl: z.string().optional().default(""),
  description: z.string().min(1, "La description ne peut pas être vide"),
  likes: z.coerce.number().int("Le nombre de likes doit être un nombre").optional(),
  authorId: z.number().int().min(1, "L'auteur est requis"),
});

export type PostFormData = z.infer<typeof postSchema>;

const postUpdateSchema = postSchema.partial();
export const parsePostCreate = postSchema.safeParse.bind(postSchema);
export const parsePostUpdate = postUpdateSchema.safeParse.bind(postUpdateSchema);

/**
 * User Model
 * Define the user data structure
 */
import { User } from "@/lib/users/models/user.model";
import { z } from "zod";

/**
 * Post Model
 * Define the post data structure
 */
export interface Post {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  likes: number;
  author: User;
  createdAt: string;
  updatedAt: string;
}

/**
 * Post creation payload
 */
export interface PostCreate {
  title: string;
  imageUrl: string;
  description: string;
  likes?: number;
  authorId: number;
}

/**
 * Post update payload (all fields optional)
 */
export type PostUpdate = Partial<PostCreate>;

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

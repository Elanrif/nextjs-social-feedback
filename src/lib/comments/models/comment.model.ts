/**
 * User Model
 * Define the user data structure
 */
import { User } from "@/lib/users/models/user.model";
import { z } from "zod";

/**
 * Comment Model
 * Define the comment data structure
 */
export interface Comment {
  id: number;
  content: string;
  postId: number;
  author: User;
  createdAt: string;
  updatedAt: string;
}

/**
 * Comment creation payload
 */
export interface CommentCreate {
  content: string;
  postId: number;
}

/**
 * Comment update payload (all fields optional)
 */
export type CommentUpdate = Partial<CommentCreate>;

export const commentSchema = z.object({
  content: z.string().min(1, "Le commentaire ne peut pas être vide"),
  postId: z.coerce.number().int("L'ID du post doit être un nombre"),
});

export type CommentFormData = z.infer<typeof commentSchema>;

const commentUpdateSchema = commentSchema.partial();
export const parseCommentCreate = commentSchema.safeParse.bind(commentSchema);
export const parseCommentUpdate = commentUpdateSchema.safeParse.bind(commentUpdateSchema);

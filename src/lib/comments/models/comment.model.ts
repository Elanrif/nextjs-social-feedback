import { UserSummary } from "@/lib/users/models/user.model";

/**
 * Comment types — API response models (no validation)
 * See: src/lib/comments/schemas/comment.schema.ts for form validation
 */

export interface Comment {
  id: number;
  content: string;
  postId: number;
  author: UserSummary;
  createdAt: string;
  updatedAt: string;
}

export interface CommentCreate {
  content: string;
  postId: number;
  authorId: number;
}

export type CommentUpdate = Partial<CommentCreate>;

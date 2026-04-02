import { UserSummary } from "@/lib/users/models/user.model";

/**
 * Post types — API response models (no validation)
 * See: src/lib/posts/schemas/post.schema.ts for form validation
 */

export interface Post {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  likes: number;
  author: UserSummary;
  createdAt: string;
  updatedAt: string;
}

export interface PostCreate {
  title: string;
  imageUrl: string;
  description: string;
  likes?: number;
  authorId: number;
}

export type PostUpdate = Partial<PostCreate>;

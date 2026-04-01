"use server";

import { revalidatePath } from "next/cache";
import { createPost, updatePost, deletePost } from "@/lib/posts/services/post.service";
import { Post, PostCreate, PostUpdate } from "@/lib/posts/models/post.model";
import { ApiError } from "@/shared/errors/api-error";
import { Result } from "@/shared/models/response.model";

export async function createPostAction(data: PostCreate): Promise<Result<Post, ApiError>> {
  const result = await createPost(data);
  if (result.ok) {
    revalidatePath("/dashboard/posts");
  }
  return result;
}

export async function updatePostAction(
  id: number,
  data: PostUpdate,
): Promise<Result<Post, ApiError>> {
  const result = await updatePost(id, data);
  if (result.ok) {
    revalidatePath("/dashboard/posts");
  }
  return result;
}

export async function deletePostAction(
  id: number,
): Promise<Result<{ success: boolean }, ApiError>> {
  const result = await deletePost(id);
  if (result.ok) {
    revalidatePath("/dashboard/posts");
  }
  return result;
}

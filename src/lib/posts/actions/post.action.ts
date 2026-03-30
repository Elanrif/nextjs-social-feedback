"use server";

import { headers } from "next/headers";
import { createPost, updatePost, deletePost } from "@/lib/posts/services/post.service";
import { Post, PostCreate, PostUpdate, postSchema } from "@/lib/posts/models/post.model";
import { ApiErrorResponse } from "@/shared/errors/api-error.server";
import { ApiError } from "@/shared/errors/api-error";
import { Result } from "@/shared/models/response.model";

/**
 * Server Action: Create a new post
 * Safely handles post creation on the server side
 */
export async function createPostAction(data: PostCreate): Promise<Result<Post, ApiError>> {
  const validation = postSchema.safeParse(data);
  if (!validation.success) {
    return {
      ok: false,
      error: {
        status: 400,
        detail: validation.error.message,
        title: "Bad Request",
        instance: undefined,
        errorCode: "VALIDATION_ERROR",
      },
    };
  }

  try {
    const config = { headers: await headers() };
    const res = await createPost(config, validation.data);

    return res;
  } catch (error: any) {
    const errMsg = ApiErrorResponse(error, "createPost action");
    return {
      ok: false,
      error: errMsg,
    };
  }
}

/**
 * Server Action: Update an existing post
 * Safely handles post updates on the server side
 */
export async function updatePostAction(
  id: number,
  data: PostUpdate,
): Promise<Result<Post, ApiError>> {
  try {
    const config = { headers: await headers() };
    const res = await updatePost(config, id, data);

    return res;
  } catch (error: any) {
    const errMsg = ApiErrorResponse(error, "updatePost action");
    return {
      ok: false,
      error: errMsg,
    };
  }
}

/**
 * Server Action: Delete a post
 * Safely handles post deletion on the server side
 */
export async function deletePostAction(
  id: number,
): Promise<Result<{ success: boolean }, ApiError>> {
  try {
    const config = { headers: await headers() };
    const res = await deletePost(config, id);

    return res;
  } catch (error: any) {
    const errMsg = ApiErrorResponse(error, "deletePost action");
    return {
      ok: false,
      error: errMsg,
    };
  }
}

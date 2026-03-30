"use server";

import { headers } from "next/headers";
import { createPost, updatePost, deletePost } from "@/lib/posts/services/post.service";
import { Post, PostCreate, PostUpdate, postSchema } from "@/lib/posts/models/post.model";
import { ApiErrorResponse } from "@/shared/errors/api-error.server";
import { ApiError } from "@/shared/errors/api-error";
import { Result } from "@/shared/models/response.model";
import { auth } from "@/lib/auth";
import { getLogger } from "@/config/logger.config";

const logger = getLogger("server");

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

  const session = await auth();

  if (!session?.user) {
    const err = {
      status: 401,
      detail: "You must be logged in",
      title: "Unauthorized",
      instance: undefined,
      errorCode: "UNAUTHORIZED",
    };
    logger.warn(
      {
        status: err.status,
        message: err.detail,
      },
      "Unauthorized",
    );
    return {
      ok: false,
      error: err,
    };
  }

  // if (session.user.role !== "ADMIN") {
  //   const err = {
  //     status: 403,
  //     detail: "You do not have permission to perform this action",
  //     title: "Forbidden",
  //     instance: undefined,
  //     errorCode: "FORBIDDEN",
  //   };
  //   logger.warn(
  //     {
  //       status: err.status,
  //       message: err.detail,
  //     },
  //     "Forbidden",
  //   );
  //   return {
  //     ok: false,
  //     error: err,
  //   };
  // }

  const config = { headers: await headers(), access_token: session.user.access_token };
  try {
    const res = await createPost(config, {
      ...validation.data,
      authorId: Number(session.user.id),
    });

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

  const session = await auth();

  if (!session?.user) {
    const err = {
      status: 401,
      detail: "You must be logged in",
      title: "Unauthorized",
      instance: undefined,
      errorCode: "UNAUTHORIZED",
    };
    logger.warn(
      {
        status: err.status,
        message: err.detail,
      },
      "Unauthorized",
    );
    return {
      ok: false,
      error: err,
    };
  }

  const config = { headers: await headers(), access_token: session.user.access_token };
  try {
    const res = await updatePost(config, id, validation.data);

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
  const session = await auth();

  if (!session?.user) {
    const err = {
      status: 401,
      detail: "You must be logged in",
      title: "Unauthorized",
      instance: undefined,
      errorCode: "UNAUTHORIZED",
    };
    logger.warn(
      {
        status: err.status,
        message: err.detail,
      },
      "Unauthorized",
    );
    return {
      ok: false,
      error: err,
    };
  }

  const config = { headers: await headers(), access_token: session.user.access_token };
  try {
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

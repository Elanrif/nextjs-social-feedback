"use server";

import { headers } from "next/headers";
import {
  createComment,
  updateComment,
  deleteComment,
} from "@/lib/comments/services/comment.service";
import {
  Comment,
  CommentCreate,
  CommentUpdate,
  commentSchema,
} from "@/lib/comments/models/comment.model";
import { ApiErrorResponse } from "@/shared/errors/api-error.server";
import { ApiError } from "@/shared/errors/api-error";
import { Result } from "@/shared/models/response.model";

/**
 * Server Action: Create a new comment
 * Safely handles comment creation on the server side
 */
export async function createCommentAction(data: CommentCreate): Promise<Result<Comment, ApiError>> {
  const validation = commentSchema.safeParse(data);
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
    const res = await createComment(config, validation.data);

    if (!res.ok) {
      return res;
    }

    return {
      ok: true,
      data: res.data,
    };
  } catch (error: any) {
    const errMsg = ApiErrorResponse(error, "createComment action");
    return {
      ok: false,
      error: errMsg,
    };
  }
}

/**
 * Server Action: Update an existing comment
 * Safely handles comment updates on the server side
 */
export async function updateCommentAction(
  id: number,
  data: CommentUpdate,
): Promise<Result<Comment, ApiError>> {
  try {
    const config = { headers: await headers() };
    const res = await updateComment(config, id, data);

    if (!res.ok) {
      return res;
    }

    return {
      ok: true,
      data: res.data,
    };
  } catch (error: any) {
    const errMsg = ApiErrorResponse(error, "updateComment action");
    return {
      ok: false,
      error: errMsg,
    };
  }
}

/**
 * Server Action: Delete a comment
 * Safely handles comment deletion on the server side
 */
export async function deleteCommentAction(
  id: number,
): Promise<Result<{ success: boolean }, ApiError>> {
  try {
    const config = { headers: await headers() };
    const res = await deleteComment(config, id);

    if (!res.ok) {
      return res;
    }

    return {
      ok: true,
      data: res.data,
    };
  } catch (error: any) {
    const errMsg = ApiErrorResponse(error, "deleteComment action");
    return {
      ok: false,
      error: errMsg,
    };
  }
}

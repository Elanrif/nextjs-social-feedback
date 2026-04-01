"server-only";

import { AxiosResponse } from "axios";
import apiClient, { Config } from "@config/api.config";
import environment from "@config/environment.config";
import { getLogger } from "@config/logger.config";
import {
  Comment,
  CommentCreate,
  CommentUpdate,
  parseCommentCreate,
  parseCommentUpdate,
} from "@/lib/comments/models/comment.model";
import { validateId } from "@/utils/utils.server";
import { Page, Result } from "@/shared/models/response.model";
import { ApiError, badRequestApiError, unauthorizedApiError } from "@/shared/errors/api-error";
import { ApiErrorResponse } from "@/shared/errors/api-error.server";
import { auth } from "@/lib/auth";

/**
 * ⚠️ Never trust the client input
 * ❌ Someone can bypass the form
 * ✅ Protection against malicious bugs
 */
const {
  api: {
    rest: {
      endpoints: { comments: COMMENTS_URL },
    },
  },
} = environment;

const logger = getLogger("server");

export type CommentFilters = {
  postId?: number;
  authorId?: number;
  page?: number;
  size?: number;
  sort?: string;
};

/**
 * Fetch all comments
 */
export async function fetchComments(
  filters?: CommentFilters,
): Promise<Result<Page<Comment[]>, ApiError>> {
  try {
    const res = await apiClient(true).get<unknown, AxiosResponse<Page<Comment[]>>>(COMMENTS_URL, {
      params: filters,
    });

    logger.debug({ count: res.data?.content?.length || 0 }, "Comments fetched");
    return { ok: true, data: res.data };
  } catch (error) {
    logger.error({}, "Failed to fetch comments");
    return {
      ok: false,
      error: ApiErrorResponse(error, "fetchComments"),
    };
  }
}

/**
 * Fetch a single comment by ID
 */
export async function fetchCommentById(id: number): Promise<Result<Comment, ApiError>> {
  const idError = validateId(id);
  if (idError) return idError;

  try {
    const res = await apiClient(true).get<unknown, AxiosResponse<Comment>>(`${COMMENTS_URL}/${id}`);

    return { ok: true, data: res.data };
  } catch (error) {
    logger.error({ id }, "Failed to fetch comment");
    return {
      ok: false,
      error: ApiErrorResponse(error, "fetchCommentById"),
    };
  }
}

/**
 * Create a new comment
 */
export async function createComment(comment: CommentCreate): Promise<Result<Comment, ApiError>> {
  /**
   * Check user authentication (RBAC)
   */
  const session = await auth();
  if (!session?.user) {
    logger.warn(
      { context: "createComment" },
      "Not logged in: only authenticated users can create comments",
    );
    return { ok: false, error: unauthorizedApiError() };
  }

  const config: Config = { access_token: session.user.access_token };

  /**
   * Validate input data
   */
  const parse = parseCommentCreate(comment);
  if (!parse.success) {
    logger.warn({ context: "createComment" }, "Validation failed for comment creation");
    return {
      ok: false,
      error: badRequestApiError(parse.error.message),
    };
  }

  /**
   * Attempt to create via API
   */
  try {
    const res = await apiClient(false, config).post<unknown, AxiosResponse<Comment>>(
      COMMENTS_URL,
      parse.data,
    );
    logger.info({ id: res.data.id, content: res.data.content }, "Comment created successfully");
    return { ok: true, data: res.data };
  } catch (error) {
    logger.error({ content: comment.content }, "Failed to create comment");
    return {
      ok: false,
      error: ApiErrorResponse(error, "createComment"),
    };
  }
}

/**
 * Update an existing comment
 */
export async function updateComment(
  id: number,
  comment: CommentUpdate,
): Promise<Result<Comment, ApiError>> {
  /**
   * Check user authentication (RBAC)
   */
  const session = await auth();
  if (!session?.user) {
    logger.warn(
      { context: "updateComment" },
      "Not logged in: only authenticated users can update comments",
    );
    return { ok: false, error: unauthorizedApiError() };
  }

  const config: Config = { access_token: session.user.access_token };

  /**
   * Validate input data
   */
  const idError = validateId(id);
  if (idError) return idError;

  const parse = parseCommentUpdate(comment);
  if (!parse.success) {
    logger.warn({ context: "updateComment" }, "Validation failed for comment update");
    return {
      ok: false,
      error: badRequestApiError(parse.error.message),
    };
  }

  /**
   * Attempt to update via API
   */
  try {
    const res = await apiClient(false, config).patch<unknown, AxiosResponse<Comment>>(
      `${COMMENTS_URL}/${id}`,
      parse.data,
    );
    logger.info({ id, content: res.data.content }, "Comment updated successfully");
    return { ok: true, data: res.data };
  } catch (error) {
    logger.error({ id }, "Failed to update comment");
    return {
      ok: false,
      error: ApiErrorResponse(error, "updateComment"),
    };
  }
}

/**
 * Delete a comment
 */
export async function deleteComment(id: number): Promise<Result<{ success: boolean }, ApiError>> {
  /**
   * Check user authentication (RBAC)
   */
  const session = await auth();
  if (!session?.user) {
    logger.warn(
      { context: "deleteComment" },
      "Not logged in: only authenticated users can delete comments",
    );
    return { ok: false, error: unauthorizedApiError() };
  }
  const config: Config = { access_token: session.user.access_token };

  /**
   * Validate input data
   */
  const idError = validateId(id);
  if (idError) return idError;

  /**
   * Attempt to delete via API
   */
  try {
    await apiClient(false, config).delete(`${COMMENTS_URL}/${id}`);
    logger.info({ id }, "Comment deleted successfully");
    return { ok: true, data: { success: true } };
  } catch (error) {
    logger.error({ id }, "Failed to delete comment");
    return {
      ok: false,
      error: ApiErrorResponse(error, "deleteComment"),
    };
  }
}

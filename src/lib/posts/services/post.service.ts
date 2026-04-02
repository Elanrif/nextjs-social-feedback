"server-only";

import { AxiosResponse } from "axios";
import apiClient, { Config } from "@config/api.config";
import environment from "@config/environment.config";
import { getLogger } from "@config/logger.config";
import { Post, PostCreate, PostUpdate } from "@/lib/posts/models/post.model";
import { parsePostCreate, parsePostUpdate } from "@/lib/posts/schemas/post.schema";
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
      endpoints: { posts: POSTS_URL },
    },
  },
} = environment;

const logger = getLogger("server");

export type PostFilters = {
  page?: number;
  size?: number;
  sort?: string;
};

/**
 * Fetch all posts
 */
export async function fetchPosts(
  filters?: PostFilters,
  config?: Config,
): Promise<Result<Page<Post[]>, ApiError>> {
  try {
    const res = await apiClient(true, config).get<unknown, AxiosResponse<Page<Post[]>>>(POSTS_URL, {
      params: filters,
    });

    logger.debug({ count: res.data?.content?.length || 0 }, "Posts fetched");
    return { ok: true, data: res.data };
  } catch (error) {
    logger.error({}, "Failed to fetch posts");
    return {
      ok: false,
      error: ApiErrorResponse(error, "fetchPosts"),
    };
  }
}

/**
 * Fetch a single post by ID
 */
export async function fetchPostById(id: number, config?: Config): Promise<Result<Post, ApiError>> {
  const idError = validateId(id);
  if (idError) return idError;

  try {
    const res = await apiClient(true, config).get<unknown, AxiosResponse<Post>>(
      `${POSTS_URL}/${id}`,
    );

    return { ok: true, data: res.data };
  } catch (error) {
    logger.error({ id }, "Failed to fetch post");
    return {
      ok: false,
      error: ApiErrorResponse(error, "fetchPostById"),
    };
  }
}

/**
 * Create a new post
 */
export async function createPost(post: PostCreate): Promise<Result<Post, ApiError>> {
  /**
   * Check user authentication (RBAC)
   */
  const session = await auth();
  if (!session?.user) {
    logger.warn(
      { context: "createPost" },
      "Not logged in: only authenticated users can create posts",
    );
    return { ok: false, error: unauthorizedApiError() };
  }

  const config: Config = { access_token: session.user.access_token };

  /**
   * Validate input data
   */
  const parse = parsePostCreate(post);
  if (!parse.success) {
    logger.warn({ context: "createPost" }, "Validation failed for post creation");
    return {
      ok: false,
      error: badRequestApiError(parse.error.message),
    };
  }

  /**
   * Attempt to create via API
   */
  try {
    const res = await apiClient(false, config).post<unknown, AxiosResponse<Post>>(
      POSTS_URL,
      parse.data,
    );

    logger.info({ id: res.data.id, title: res.data.title }, "Post created successfully");
    return { ok: true, data: res.data };
  } catch (error) {
    logger.error({ title: post.title }, "Failed to create post");
    return {
      ok: false,
      error: ApiErrorResponse(error, "createPost"),
    };
  }
}

/**
 * Update an existing post
 */
export async function updatePost(id: number, post: PostUpdate): Promise<Result<Post, ApiError>> {
  /**
   * Check user authentication (RBAC)
   */
  const session = await auth();
  if (!session?.user) {
    logger.warn(
      { context: "updatePost" },
      "Not logged in: only authenticated users can update posts",
    );
    return { ok: false, error: unauthorizedApiError() };
  }

  const config: Config = { access_token: session.user.access_token };

  /**
   * Validate input data
   */
  const idError = validateId(id);
  if (idError) return idError;

  const parse = parsePostUpdate(post);
  if (!parse.success) {
    logger.warn({ context: "updatePost" }, "Validation failed for post update");
    return {
      ok: false,
      error: badRequestApiError(parse.error.message),
    };
  }

  /**
   * Attempt to update via API
   */
  try {
    const res = await apiClient(false, config).patch<unknown, AxiosResponse<Post>>(
      `${POSTS_URL}/${id}`,
      parse.data,
    );

    logger.info({ id, title: res.data.title }, "Post updated successfully");
    return { ok: true, data: res.data };
  } catch (error) {
    logger.error({ id }, "Failed to update post");
    return {
      ok: false,
      error: ApiErrorResponse(error, "updatePost"),
    };
  }
}

/**
 * Delete a post
 */
export async function deletePost(id: number): Promise<Result<{ success: boolean }, ApiError>> {
  /**
   * Check user authentication (RBAC)
   */
  const session = await auth();
  if (!session?.user) {
    logger.warn(
      { context: "deletePost" },
      "Not logged in: only authenticated users can delete posts",
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
    await apiClient(false, config).delete(`${POSTS_URL}/${id}`);
    logger.info({ id }, "Post deleted successfully");
    return { ok: true, data: { success: true } };
  } catch (error) {
    logger.error({ id }, "Failed to delete post");
    return {
      ok: false,
      error: ApiErrorResponse(error, "deletePost"),
    };
  }
}

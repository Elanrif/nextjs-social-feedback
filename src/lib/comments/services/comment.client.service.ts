"use client";

import { AxiosResponse } from "axios";
import { frontendHttp } from "@config/axios/frontend-http.config";
import { proxyEnvironment } from "@config/proxy-api.config";
import { Comment } from "@/lib/comments/models/comment.model";
import { ApiError } from "@/shared/errors/api-error";
import { CommentFilters } from "./comment.service";
import { Page, Result } from "@/shared/models/response.model";

const {
  api: {
    endpoints: { comments: COMMENTS_URL },
  },
} = proxyEnvironment;

/**
 * Fetch all comments (client-side)
 */
export async function fetchComments(
  filters?: CommentFilters,
): Promise<Result<Page<Comment[]>, ApiError>> {
  const res = await frontendHttp().get<unknown, AxiosResponse<Result<Page<Comment[]>, ApiError>>>(
    COMMENTS_URL,
    { params: filters },
  );
  return res.data;
}

/**
 * Fetch a single comment by ID (client-side)
 */
export async function fetchCommentById(id: number): Promise<Result<Comment, ApiError>> {
  const res = await frontendHttp().get<unknown, AxiosResponse<Result<Comment, ApiError>>>(
    `${COMMENTS_URL}/${id}`,
  );
  return res.data;
}

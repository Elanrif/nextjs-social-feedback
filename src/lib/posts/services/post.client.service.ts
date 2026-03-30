"use client";

import { AxiosResponse } from "axios";
import { frontendHttp } from "@config/axios/frontend-http.config";
import { proxyEnvironment } from "@config/proxy-api.config";
import { Post } from "@/lib/posts/models/post.model";
import { ApiError } from "@/shared/errors/api-error";
import { Page, Result } from "@/shared/models/response.model";
import type { PostFilters } from "./post.service";

const {
  api: {
    endpoints: { posts: POSTS_URL },
  },
} = proxyEnvironment;

/**
 * Fetch all posts (client-side)
 */
export async function fetchPosts(filters?: PostFilters): Promise<Result<Page<Post[]>, ApiError>> {
  const res = await frontendHttp().get<unknown, AxiosResponse<Result<Page<Post[]>, ApiError>>>(
    POSTS_URL,
    { params: filters },
  );
  return res.data;
}

/**
 * Fetch a single post by ID (client-side)
 */
export async function fetchPostById(id: number): Promise<Result<Post, ApiError>> {
  const res = await frontendHttp().get<unknown, AxiosResponse<Result<Post, ApiError>>>(
    `${POSTS_URL}/${id}`,
  );
  return res.data;
}

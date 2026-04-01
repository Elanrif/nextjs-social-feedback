import { NextRequest, NextResponse } from "next/server";
import { CommentFilters, fetchComments } from "@/lib/comments/services/comment.service";
import { getLogger } from "@config/logger.config";
import { ApiErrorResponse } from "@/shared/errors/api-error.server";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

/**
 * GET /api/comments
 * Fetch all comments
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const filters: CommentFilters = {
    postId: searchParams.get("postId") ? Number(searchParams.get("postId")) : undefined,
    authorId: searchParams.get("authorId") ? Number(searchParams.get("authorId")) : undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
    size: searchParams.get("size") ? Number(searchParams.get("size")) : undefined,
    sort: searchParams.get("sort") ?? undefined,
  };
  try {
    const response = await fetchComments(filters);
    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    const errMsg = ApiErrorResponse(error, "fetchComments");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.detail }, "Error during comments fetching");
    return NextResponse.json({ ok: false, error: errMsg }, { status });
  }
}

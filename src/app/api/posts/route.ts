import { NextRequest, NextResponse } from "next/server";
import { fetchPosts, type PostFilters } from "@/lib/posts/services/post.service";
import { getLogger } from "@config/logger.config";
import { ApiErrorResponse } from "@/shared/errors/api-error.server";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

/**
 * GET /api/posts
 * Fetch all posts with optional filters
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const filters: PostFilters = {
    page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
    size: searchParams.get("size") ? Number(searchParams.get("size")) : undefined,
    sort: searchParams.get("sort") ?? undefined,
  };

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const response = await fetchPosts(filters, config);

    if (!response.ok) {
      const error = response.error!;
      return NextResponse.json(response, {
        status: error.status,
      });
    }

    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    const errMsg = ApiErrorResponse(error, "fetchPosts");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.detail }, "Error during posts fetching");
    return NextResponse.json({ ok: false, error: errMsg }, { status });
  }
}

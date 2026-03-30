import { NextRequest, NextResponse } from "next/server";
import { fetchPostById } from "@/lib/posts/services/post.service";
import { getLogger } from "@config/logger.config";
import { ApiErrorResponse } from "@/shared/errors/api-error.server";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

/**
 * GET /api/posts/[id]
 */
export async function GET(request: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const postId = Number.parseInt(id, 10);

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const response = await fetchPostById(postId, config);

    if (!response.ok) {
      return NextResponse.json(response, { status: response.error.status });
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const errMsg = ApiErrorResponse(error, "fetchPostById");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.detail }, "Error during post fetching");
    return NextResponse.json({ ok: false, error: errMsg }, { status });
  }
}

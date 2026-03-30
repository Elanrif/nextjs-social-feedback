import { NextRequest, NextResponse } from "next/server";
import { fetchCommentById } from "@/lib/comments/services/comment.service";
import { getLogger } from "@config/logger.config";
import { ApiErrorResponse } from "@/shared/errors/api-error.server";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;
/**
 * GET /api/comments/[id]
 * Fetch a comment by ID
 */
export async function GET(request: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const commentId = Number.parseInt(id, 10);

  try {
    const response = await fetchCommentById(commentId);

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
    const errMsg = ApiErrorResponse(error, "fetchCommentById");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.detail }, "Error during comment fetching");
    return NextResponse.json({ ok: false, error: errMsg }, { status });
  }
}

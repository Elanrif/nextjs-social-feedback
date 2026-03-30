import { NextRequest, NextResponse } from "next/server";
import { fetchPostById, updatePost, deletePost } from "@/lib/posts/services/post.service";
import { parsePostUpdate } from "@/lib/posts/models/post.model";
import { getLogger } from "@config/logger.config";
import { ApiErrorResponse } from "@/shared/errors/api-error.server";
import { validationError } from "@/utils/utils.server";

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

/**
 * PATCH /api/posts/[id]
 */
export async function PATCH(request: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const postId = Number.parseInt(id, 10);

  const body = await request.json().catch(() => null);
  const parsed = parsePostUpdate(body);
  if (!parsed.success) {
    const err = validationError(parsed.error.issues, "Invalid post data");
    return NextResponse.json(err, { status: 400 });
  }

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const response = await updatePost(config, postId, parsed.data);

    if (!response.ok) {
      return NextResponse.json(response, { status: response.error.status });
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const errMsg = ApiErrorResponse(error, "updatePost");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.detail }, "Error during post update");
    return NextResponse.json({ ok: false, error: errMsg }, { status });
  }
}

/**
 * DELETE /api/posts/[id]
 */
export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const postId = Number.parseInt(id, 10);

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const response = await deletePost(config, postId);

    if (!response.ok) {
      return NextResponse.json(response, { status: response.error.status });
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const errMsg = ApiErrorResponse(error, "deletePost");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.detail }, "Error during post deletion");
    return NextResponse.json({ ok: false, error: errMsg }, { status });
  }
}

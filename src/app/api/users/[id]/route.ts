import { NextRequest, NextResponse } from "next/server";
import { getLogger } from "@config/logger.config";
import { fetchUserById, updateUser, deleteUser } from "@/lib/users/services/user.service";
import { ApiErrorResponse } from "@/shared/errors/api-error.server";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

/**
 * GET /api/users/[id]
 * Fetch a user by ID
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  const userId = Number.parseInt(id, 10);

  try {
    const response = await fetchUserById(userId);
    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    const errMsg = ApiErrorResponse(error, "fetchUserById");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.detail }, "Error during user fetching");
    return NextResponse.json({ ok: false, error: errMsg }, { status });
  }
}

/**
 * PATCH /api/users/[id]
 * Update a user by ID
 */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  const userId = Number.parseInt(id, 10);
  const body = await request.json().catch(() => null);

  try {
    const response = await updateUser(userId, body);
    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    const errMsg = ApiErrorResponse(error, "updateUser");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.detail }, "Error during user update");
    return NextResponse.json({ ok: false, error: errMsg }, { status });
  }
}

/**
 * DELETE /api/users/[id]
 * Delete a user by ID
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  const userId = Number.parseInt(id, 10);

  try {
    const response = await deleteUser(userId);
    logger.info({ userId }, "User deleted");
    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    const errMsg = ApiErrorResponse(error, "deleteUser");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.detail }, "Error during user deletion");
    return NextResponse.json({ ok: false, error: errMsg }, { status });
  }
}

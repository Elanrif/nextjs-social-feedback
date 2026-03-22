import { NextRequest, NextResponse } from "next/server";
import { getLogger } from "@config/logger.config";
import { fetchUserById, updateUser, deleteUser } from "@/lib/users/services/user.service";
import { parseUserUpdate } from "@/lib/users/models/user.model";
import { crudApiErrorResponse } from "@/lib/shared/helpers/crud-api-error.server";
import { validationError } from "@/utils/utils.server";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

/**
 * GET /api/users/[id]
 * Fetch a user by ID
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  const userId = Number.parseInt(id, 10);

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const response = await fetchUserById(userId, config);
    if (!response.ok) {
      return NextResponse.json(response, {
        status: response.error?.status || 500,
      });
    }
    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "fetchUserById");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.message }, "Error during user fetching");
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
  const parsed = parseUserUpdate(body);
  if (!parsed.success) {
    const err = validationError(parsed.error.issues, "Invalid user data");
    return NextResponse.json(err, {
      status: 400,
    });
  }

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const response = await updateUser(userId, parsed.data, config);
    if (!response.ok) {
      const error = response.error;
      return NextResponse.json(response, {
        status: error.status,
      });
    }
    logger.info({ userId }, "User updated");
    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "updateUser");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.message }, "Error during user update");
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

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const response = await deleteUser(userId, config);

    if (!response.ok) {
      const error = response.error;
      return NextResponse.json(response, {
        status: error.status,
      });
    }

    logger.info({ userId }, "User deleted");
    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "deleteUser");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.message }, "Error during user deletion");
    return NextResponse.json({ ok: false, error: errMsg }, { status });
  }
}

import { fetchAllUsers, createUser } from "@lib/users/services/user.service";
import { NextRequest, NextResponse } from "next/server";
import { parseUserCreate } from "@/lib/users/models/user.model";
import { getLogger } from "@config/logger.config";
import { crudApiErrorResponse } from "@/lib/errors/crud-api-error.server";
import { validationError } from "@/utils/utils.server";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

/**
 * GET /api/users
 * Fetch all users
 */
export async function GET(request: NextRequest) {
  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const response = await fetchAllUsers(config);

    if (!response.ok) {
      return NextResponse.json(response, {
        status: response.error?.status || 500,
      });
    }

    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "fetchAllUser");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.detail }, "Error during user fetching");
    return NextResponse.json({ ok: false, error: errMsg }, { status });
  }
}

/**
 * POST /api/users
 * Create a new user
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = parseUserCreate(body);
  if (!parsed.success) {
    const err = validationError(parsed.error.issues, "Invalid user data");
    return NextResponse.json(err, {
      status: 400,
    });
  }

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    // UserFormData includes confirmPassword which the backend ignores

    const response = await createUser(config, parsed.data as any);

    if (!response.ok) {
      return NextResponse.json(response, {
        status: response.error.status,
      });
    }

    return NextResponse.json(response, {
      status: 201,
    });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "createUser");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.detail }, "Error during user creation");
    return NextResponse.json({ ok: false, error: errMsg }, { status });
  }
}

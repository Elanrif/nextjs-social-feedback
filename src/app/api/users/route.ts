import { fetchAllUsers, createUser } from "@lib/users/services/user.service";
import { NextRequest, NextResponse } from "next/server";
import { getLogger } from "@config/logger.config";
import { ApiErrorResponse } from "@/shared/errors/api-error.server";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

/**
 * GET /api/users
 * Fetch all users
 */
export async function GET() {
  try {
    const response = await fetchAllUsers();
    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    const errMsg = ApiErrorResponse(error, "fetchAllUser");
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

  try {
    const response = await createUser(body);
    return NextResponse.json(response, {
      status: 201,
    });
  } catch (error) {
    const errMsg = ApiErrorResponse(error, "createUser");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.detail }, "Error during user creation");
    return NextResponse.json({ ok: false, error: errMsg }, { status });
  }
}

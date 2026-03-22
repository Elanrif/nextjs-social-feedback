import { searchUsersFilter } from "@lib/users/services/user.service";
import { NextRequest, NextResponse } from "next/server";
import { getLogger } from "@config/logger.config";
import { crudApiErrorResponse } from "@/lib/shared/helpers/crud-api-error.server";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

/**
 * GET /api/users/search?email=...&firstName=...&lastName=...&isActive=...
 * Search users with optional filters — proxies to Spring Boot GET /users/search
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const filters = {
    email: searchParams.get("email") ?? undefined,
    firstName: searchParams.get("firstName") ?? undefined,
    lastName: searchParams.get("lastName") ?? undefined,
    isActive: searchParams.has("isActive") ? searchParams.get("isActive") === "true" : undefined,
  };

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const response = await searchUsersFilter(filters, config);

    if (!response.ok) {
      return NextResponse.json(response, {
        status: response.error?.status || 500,
      });
    }

    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "searchUsersFilter");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.message }, "Error during users search");
    return NextResponse.json({ ok: false, error: errMsg }, { status });
  }
}

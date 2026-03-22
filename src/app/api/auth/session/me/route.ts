import { NextResponse } from "next/server";
import { getLogger } from "@/config/logger.config";
import { crudApiErrorResponse } from "@/lib/shared/helpers/crud-api-error.server";
import { getCurrentUser } from "@/lib/auth/next-auth/next-auth.service";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await getCurrentUser();

    if (!response.ok) {
      const status = response.error?.status || 401;
      return NextResponse.json(response, { status });
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "session/me");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.message }, "Error fetching current user");
    return NextResponse.json({ ok: false, error: errMsg }, { status });
  }
}

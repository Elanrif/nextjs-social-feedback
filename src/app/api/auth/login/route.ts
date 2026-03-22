import { NextRequest, NextResponse } from "next/server";
import { Login } from "@/lib/auth/models/auth.model";
import { getLogger } from "@/config/logger.config";
import { crudApiErrorResponse } from "@/lib/shared/helpers/crud-api-error.server";
import { auth } from "@/lib/auth/api/auth";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/login
 * Sign in a user
 */
export async function POST(req: NextRequest) {
  const body = (await req.json()) as Login;

  const reqHeaders = new Headers(req.headers);
  const config = { headers: reqHeaders };

  try {
    const response = await auth.api.signIn({
      body,
      config,
    });

    if (!response.ok) {
      const error = response.error;
      return NextResponse.json(response, {
        status: error.status,
      });
    }

    logger.info({ userId: response.data.id }, "User signed in");
    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "login");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.message }, "Error during sign in");
    return NextResponse.json({ ok: false, error: errMsg }, { status });
  }
}

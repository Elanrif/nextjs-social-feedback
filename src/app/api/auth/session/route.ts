import { NextResponse } from "next/server";
import { getLogger } from "@/config/logger.config";
import {
  CrudApiError,
  crudApiErrorResponse,
  Result,
} from "@/lib/shared/helpers/crud-api-error.server";
import { Session } from "@/lib/auth/models/auth.model";
import { getSession } from "@/lib/auth/better-auth/better-auth.service";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse<Result<Session, CrudApiError>>> {
  try {
    const session = await getSession();

    if (!session.ok) {
      logger.warn({ message: session.error.message }, "Unauthorized session request");
      return NextResponse.json({ ok: false, error: session.error }, { status: 401 });
    }

    return NextResponse.json(session, { status: 200 });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "session");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.message }, "Error during session verification");
    return NextResponse.json({ ok: false, error: errMsg }, { status });
  }
}

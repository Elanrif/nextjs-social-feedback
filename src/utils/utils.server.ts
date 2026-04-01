import "server-only";

import { NextRequest } from "next/server";
import { ApiError } from "@/shared/errors/api-error";
import { Result } from "@/shared/models/response.model";

/** Returns the request ID from the `x-request-id` header, or generates a new one. */
export function ensureRequestID(req: NextRequest): string {
  return req.headers.get("x-request-id") ?? crypto.randomUUID();
}

/** Returns a structured 400 result when an ID param is not a positive integer. */
export function validateId(id: number): Result<never, ApiError> | null {
  if (!Number.isInteger(id) || id <= 0) {
    return {
      ok: false,
      error: {
        status: 400,
        detail: "Invalid user ID",
        title: "Bad Request",
        instance: undefined,
        errorCode: "INVALID_ID",
      },
    };
  }
  return null;
}

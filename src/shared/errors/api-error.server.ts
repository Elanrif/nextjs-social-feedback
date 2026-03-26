import "server-only";

import { AxiosError } from "axios";
import { getLogger } from "@/config/logger.config";
import { ApiError } from "./api-error";

const logger = getLogger("server");

/**
 * Converts any caught error into a structured `ApiError`.
 * - Axios errors: extracts the backend RFC 7807 response body, logs warn (<500) or error (≥500).
 * - Other errors: returns a 500 Internal Error and logs as error.
 *
 * @param context - call-site label shown in the log (e.g. `"fetchProducts"`)
 */
export function ApiErrorResponse(error: unknown, context?: string): ApiError {
  if (error instanceof AxiosError) {
    const raw = error.response?.data || {
      status: error.response?.status ?? 500,
      detail: error.message || "Unknown Axios error",
      title: "Error",
      instance: undefined,
      errorCode: "NETWORK_ERROR",
    };
    // Strip backend stack trace — it belongs in the backend logs, not ours.
    const { trace: _, ...apiError } = raw as ApiError & {
      trace?: string;
    };
    if (apiError.status >= 500) {
      logger.error(apiError, `[Axios Error] [${context ?? "unknown"}]`);
    } else {
      logger.warn(apiError, `[Axios Error] [${context ?? "unknown"}]`);
    }
    return apiError;
  }

  const fallbackError: ApiError = {
    status: 500,
    detail: (error as Error)?.message || "Unknown error",
    title: "Internal Error",
    instance: undefined,
    errorCode: "INTERNAL_ERROR",
  };
  logger.error(fallbackError, `[HTTP Error] [${context ?? "unknown"}]`);
  return fallbackError;
}

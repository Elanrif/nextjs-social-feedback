import "server-only";

import { AxiosError } from "axios";
import { getLogger } from "@/config/logger.config";
import type { CrudApiError } from "./crud-api-error";

export type { CrudApiError, Result } from "./crud-api-error";

const logger = getLogger("server");

/**
 * Converts any caught error into a structured `CrudApiError`.
 * - Axios errors: extracts API response body, logs warn (<500) or error (≥500).
 * - Other errors: returns a 500 Internal Error and logs as error.
 *
 * @param context - call-site label shown in the log (e.g. `"fetchProducts"`)
 */
export function crudApiErrorResponse(error: unknown, context?: string): CrudApiError {
  if (error instanceof AxiosError) {
    const raw = error.response?.data || {
      status: error.response?.status ?? 500,
      message: error.message || "Unknown Axios error",
      error: "Error",
      timestamp: new Date().toISOString(),
    };
    // Strip backend stack trace — it belongs in the backend logs, not ours.
    const { trace: _, ...apiError } = raw as CrudApiError & {
      trace?: string;
    };
    if (apiError.status >= 500) {
      logger.error(apiError, `[Axios Error] [${context ?? "unknown"}]`);
    } else {
      logger.warn(apiError, `[Axios Error] [${context ?? "unknown"}]`);
    }
    return apiError;
  }

  const fallbackError: CrudApiError = {
    status: 500,
    message: (error as Error)?.message || "Unknown error",
    error: "Internal Error",
    timestamp: new Date().toISOString(),
  };
  logger.error(fallbackError, `[HTTP Error] [${context ?? "unknown"}]`);
  return fallbackError;
}

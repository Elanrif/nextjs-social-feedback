/**
 * Shared error types and helpers — safe to import in both server and client code.
 * Do NOT add any server-only imports (pino, server actions, etc.) to this file.
 */

/** Error shape returned by the Spring Boot API. */
export type CrudApiError = {
  timestamp?: string;
  error: string; // e.g. "Bad Request", "Unauthorized"
  status: number; // HTTP status code
  message: string; // human-readable error message
  details?: unknown; // optional Zod validation issues
};

/** Discriminated union for API responses — use `res.ok` to narrow. */
export type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

/**
 * Type guard for the `T | CrudApiError` union pattern.
 * Use instead of `"error" in res` — narrows the type correctly.
 *
 * @example
 * const res = await fetchCategories();
 * if (isCrudError(res)) { console.error(res.message); return; }
 * // res is Category[] here
 */
export function isCrudError(value: unknown): value is CrudApiError {
  return (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    "status" in value &&
    "message" in value
  );
}

/**
 * Error class for programmatic API errors (e.g. thrown in interceptors).
 * Provides `statusCode` and `errorType` accessors.
 */
export class ApiError extends Error {
  public timestamp: string;
  public error: string;

  constructor(
    message: string,
    public status: number,
    error?: string,
  ) {
    super(message);
    this.name = "ApiError";
    this.timestamp = new Date().toISOString();
    this.error = error ?? (status === 400 ? "Bad Request" : "Error");
  }

  get statusCode() {
    return this.status;
  }
  set statusCode(value) {
    this.status = value;
  }
  get errorType() {
    return this.error;
  }
  set errorType(value) {
    this.error = value;
  }
}

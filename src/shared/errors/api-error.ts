/**
 * Shared error types and helpers — safe to import in both server and client code.
 * Do NOT add any server-only imports (pino, server actions, etc.) to this file.
 */

/** Error shape returned by the Spring Boot API (RFC 7807 Problem Details). */
export type ApiError = {
  detail: string;
  instance?: string;
  status: number;
  title: string;
  errorCode: string;
};

/**
 * Type guard for the `T | ApiError` union pattern.
 * Use instead of `"error" in res` — narrows the type correctly.
 *
 * @example
 * const res = await fetchCategories();
 * if (isApiError(res)) { console.error(res.detail); return; }
 * // res is Category[] here
 */
export function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === "object" &&
    value !== null &&
    "errorCode" in value &&
    "status" in value &&
    "detail" in value
  );
}

/**
 * Error class for programmatic API errors (e.g. thrown in interceptors).
 */
export class ApiError_ extends Error {
  public status: number;
  public title: string;
  public instance?: string;
  public errorCode: string;

  constructor(
    detail: string,
    status: number,
    title?: string,
    errorCode?: string,
    instance?: string,
  ) {
    super(detail);
    this.name = "ApiError";
    this.status = status;
    this.title = title ?? (status === 400 ? "Bad Request" : "Error");
    this.errorCode = errorCode ?? "INTERNAL_ERROR";
    this.instance = instance;
  }
}

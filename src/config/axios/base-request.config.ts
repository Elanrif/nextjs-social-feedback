export const baseRequestConfig = {
  baseURL: "",
  timeout: 60_000,
  headers: {
    Accept: "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    "Content-Type": "application/json; charset=utf-8",
    Expires: "0",
    Pragma: "no-cache",
  },
} as const;

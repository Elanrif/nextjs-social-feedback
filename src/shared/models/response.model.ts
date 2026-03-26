export interface Graph<T> {
  data: { [key: string]: T };
}

export interface Page<T> {
  count: number;
  next: string;
  previous: string;
  results: T;
}

export interface Pager<T> {
  page?: Page<T>;
  count: number;
  results: T;
}

/** Discriminated union for API responses — use `res.ok` to narrow. */
export type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

export interface Graph<T> {
  data: { [key: string]: T };
}

export interface Page_<T> {
  count: number;
  next: string;
  previous: string;
  results: T;
}

export interface Pager<T> {
  page?: Page_<T>;
  count: number;
  results: T;
}

export interface Page<T> {
  content: T;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

/** Discriminated union for API responses — use `res.ok` to narrow. */
export type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

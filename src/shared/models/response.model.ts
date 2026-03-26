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

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merges Tailwind classes with clsx + tailwind-merge. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidImgUrl(url: unknown): url is string {
  if (typeof url !== "string" || url.length === 0) return false;
  // Must be absolute URL or relative path starting with /
  return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/");
}

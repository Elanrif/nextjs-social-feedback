"use client";

import { ErrorPage } from "@/components/features/error-page";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <ErrorPage error={error} reset={reset} />
    </div>
  );
}

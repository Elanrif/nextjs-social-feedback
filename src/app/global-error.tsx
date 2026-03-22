"use client";

import { ErrorPage } from "@/components/features/error-page";

/**
 * Catches errors thrown inside RootLayout itself.
 * Must include <html> and <body> since the layout is unavailable.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-gray-50">
        <ErrorPage error={error} reset={reset} />
      </body>
    </html>
  );
}

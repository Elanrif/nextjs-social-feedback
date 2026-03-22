"use client";

import { AlertTriangle } from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  message?: string;
}

export function ErrorPage({
  error,
  reset,
  title = "Une erreur est survenue",
  message = "Quelque chose s'est mal passé. Veuillez réessayer.",
}: ErrorPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-50">
        <AlertTriangle className="w-10 h-10 text-red-400" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
        <p className="text-gray-500 max-w-md">{message}</p>
        {error.digest && <p className="text-xs text-gray-400 font-mono">ID: {error.digest}</p>}
      </div>
      <button
        onClick={reset}
        className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg
          transition-colors"
      >
        Réessayer
      </button>
    </div>
  );
}

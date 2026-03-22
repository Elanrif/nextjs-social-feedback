import Link from "next/link";
import { FileSearch } from "lucide-react";

interface NotFoundProps {
  title?: string;
  message?: string;
  backHref?: string;
  backLabel?: string;
}

export function NotFound({
  title = "Page introuvable",
  message = "La ressource que vous recherchez n'existe pas ou a été supprimée.",
  backHref = "/dashboard",
  backLabel = "Retour au tableau de bord",
}: NotFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gray-100">
        <FileSearch className="w-10 h-10 text-gray-400" />
      </div>
      <div className="space-y-2">
        <p className="text-7xl font-bold text-gray-200">404</p>
        <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
        <p className="text-gray-500 max-w-md">{message}</p>
      </div>
      <Link
        href={backHref}
        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium
          rounded-lg transition-colors"
      >
        {backLabel}
      </Link>
    </div>
  );
}

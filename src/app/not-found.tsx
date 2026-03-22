import { NotFound } from "@/components/features/not-found";

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <NotFound
        title="Page introuvable"
        message="La page que vous recherchez n'existe pas."
        backHref="/"
        backLabel="Retour à l'accueil"
      />
    </div>
  );
}

import { NotFound } from "@/components/features/not-found";

export default function DashboardNotFound() {
  return (
    <NotFound
      title="Ressource introuvable"
      message="La ressource que vous recherchez n'existe pas ou a été supprimée."
      backHref="/dashboard"
      backLabel="Retour au tableau de bord"
    />
  );
}

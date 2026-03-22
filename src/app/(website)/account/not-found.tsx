import { NotFound } from "@/components/features/not-found";

export default function AccountNotFound() {
  return (
    <NotFound
      title="Page introuvable"
      message="La page que vous recherchez n'existe pas dans votre espace compte."
      backHref="/account"
      backLabel="Retour à mon compte"
    />
  );
}

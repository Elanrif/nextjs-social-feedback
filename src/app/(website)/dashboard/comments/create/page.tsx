import { CommentCreateForm } from "@/components/features/dashboard/comments/comment-create-form";

export const metadata = {
  title: "Nouveau commentaire",
  description: "Créer un nouveau commentaire",
};

export default function Page() {
  return <CommentCreateForm />;
}

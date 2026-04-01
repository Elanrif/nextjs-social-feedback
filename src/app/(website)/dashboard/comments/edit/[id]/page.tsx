import { notFound } from "next/navigation";
import { CommentEditForm } from "@/components/features/dashboard/comments/comment-edit-form";
import { fetchCommentById } from "@/lib/comments/services/comment.service";

export const metadata = {
  title: "Modifier commentaire",
  description: "Modifier un commentaire existant",
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const res = await fetchCommentById(Number(id));
  if (!res.ok) notFound();

  return <CommentEditForm loadedComment={res.data} />;
}

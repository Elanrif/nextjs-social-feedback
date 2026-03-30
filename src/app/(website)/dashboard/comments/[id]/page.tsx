import { notFound } from "next/navigation";
import { CommentDetail } from "@/components/features/dashboard/comments/comment-detail";
import { fetchCommentById } from "@/lib/comments/services/comment.service";
import { headers } from "next/headers";

export const metadata = {
  title: "Détail commentaire",
  description: "Voir les détails d'un commentaire",
};

// SSR intentional: detail page either has data or returns 404.
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const reqHeaders = await headers();
  const config = { headers: reqHeaders };

  const res = await fetchCommentById(Number(id), config);
  if (!res.ok) notFound();

  return <CommentDetail comment={res.data} />;
}

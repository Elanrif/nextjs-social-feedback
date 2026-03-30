import { notFound } from "next/navigation";
import { PostDetail } from "@/components/features/dashboard/posts/post-detail";
import { fetchPostById } from "@/lib/posts/services/post.service";
import { headers } from "next/headers";

export const metadata = {
  title: "Détail post",
  description: "Voir les détails d'un post",
};

// SSR intentional: detail page either has data or returns 404.
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const reqHeaders = await headers();
  const config = { headers: reqHeaders };

  const res = await fetchPostById(Number(id), config);
  if (!res.ok) notFound();

  return <PostDetail post={res.data} />;
}

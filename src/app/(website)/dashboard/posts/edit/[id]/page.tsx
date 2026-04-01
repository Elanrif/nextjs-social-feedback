import { notFound } from "next/navigation";
import { PostEditForm } from "@/components/features/dashboard/posts/post-edit-form";
import { fetchPostById } from "@/lib/posts/services/post.service";

export const metadata = {
  title: "Modifier post",
  description: "Modifier un post existant",
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const res = await fetchPostById(Number(id));
  if (!res.ok) notFound();

  return <PostEditForm loadedPost={res.data} />;
}

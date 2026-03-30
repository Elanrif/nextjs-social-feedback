import { PostCreateForm } from "@/components/features/dashboard/posts/post-create-form";

export const metadata = {
  title: "Nouveau post",
  description: "Créer un nouveau post",
};

export default function Page() {
  return <PostCreateForm />;
}

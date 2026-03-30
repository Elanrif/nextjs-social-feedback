import { CommentList } from "@/components/features/dashboard/comments/comment-list";

export const metadata = {
  title: "Commentaires",
  description: "Gérer les commentaires",
};

// No SSR here: protected admin page, React Query handles fetching and cache invalidation.
export default function Page() {
  return <CommentList />;
}

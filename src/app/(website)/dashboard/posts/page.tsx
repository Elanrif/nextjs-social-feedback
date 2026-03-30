import { PostList } from "@/components/features/dashboard/posts/post-list";

export const metadata = {
  title: "Posts",
  description: "Gérer les posts",
};

// No SSR here: protected admin page, React Query handles fetching and cache invalidation.
export default function Page() {
  return <PostList />;
}

import { FeedLayout } from "@/components/features/feed/feed-layout";
import { PostFeed } from "@/components/features/feed/post-feed";

export const metadata = {
  title: "Social Feedback",
  description: "Découvrez et participez aux discussions.",
};

export default function Home() {
  return (
    <FeedLayout>
      <PostFeed />
    </FeedLayout>
  );
}

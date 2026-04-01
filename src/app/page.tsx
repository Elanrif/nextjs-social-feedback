import { FeedLayout } from "@/components/features/feed/feed-layout";
import { PostFeed } from "@/components/features/feed/post-feed";

export const metadata = {
  title: "nextjs social feedback - Modern Boilerplate",
  description:
    "Kickstart your Next.js project with a modern boilerplate" +
    "featuring authentication, dashboard, and more.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <FeedLayout>
        <PostFeed />
      </FeedLayout>
    </div>
  );
}

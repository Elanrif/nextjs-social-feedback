"use client";

import { usePosts } from "@/lib/posts/hooks/use-posts";
import { PostCard } from "./post-card";

function PostSkeleton() {
  return (
    <div className="border border-border rounded-xl p-4 bg-card animate-pulse">
      <div className="flex items-start gap-3">
        <div className="size-10 rounded-full bg-muted shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-32 bg-muted rounded" />
          <div className="h-2 w-20 bg-muted rounded" />
        </div>
      </div>
      <div className="mt-3 ml-13 space-y-2">
        <div className="h-3 w-full bg-muted rounded" />
        <div className="h-3 w-4/5 bg-muted rounded" />
        <div className="h-3 w-3/5 bg-muted rounded" />
      </div>
    </div>
  );
}

export function PostFeed() {
  const { data, isLoading, isError } = usePosts();
  const posts = data?.content ?? [];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-16 text-muted-foreground text-sm">
        Impossible de charger les publications.
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground text-sm">
        Aucune publication pour le moment.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

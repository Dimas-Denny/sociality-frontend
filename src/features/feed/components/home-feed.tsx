"use client";

import { useCallback } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PostCard } from "@/features/posts/components/post-card";
import { PostCardSkeleton } from "@/features/posts/components/post-card-skeleton";
import { useOnVisible } from "@/hooks/use-on-visible";
import { getErrorMessage } from "@/lib/api";
import { useHomePosts } from "../hooks";

export function HomeFeed() {
  const {
    posts,
    isAuthenticated,
    isReady,
    isPending,
    isError,
    error,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useHomePosts();

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const sentinelRef = useOnVisible<HTMLDivElement>(
    loadMore,
    Boolean(hasNextPage),
  );

  // Loading (also while the auth cookie is being checked)
  if (!isReady || isPending) {
    return (
      <div>
        {Array.from({ length: 3 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
    );
  }

  if (posts.length === 0) {
    return isAuthenticated ? (
      <EmptyState
        title="Your feed is empty"
        description="Follow people to see their posts here."
        action={
          <Button
            render={<Link href="/users/search" />}
            nativeButton={false}
            className="h-10 rounded-full bg-primary-300 px-6 font-bold hover:bg-primary-200"
          >
            Find people
          </Button>
        }
      />
    ) : (
      <EmptyState title="No posts yet" />
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {/* Infinite scroll trigger */}
      <div ref={sentinelRef} className="flex justify-center py-6">
        {isFetchingNextPage && (
          <Loader2 className="size-6 animate-spin text-neutral-400" />
        )}
        {!hasNextPage && (
          <p className="text-sm text-neutral-600">You&apos;re all caught up</p>
        )}
      </div>
    </div>
  );
}

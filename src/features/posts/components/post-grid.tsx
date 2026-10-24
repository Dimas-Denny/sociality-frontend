"use client";

import { useCallback } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { ErrorState } from "@/components/shared/error-state";
import { useOnVisible } from "@/hooks/use-on-visible";
import { getErrorMessage } from "@/lib/api";
import type { InfinitePostsResult } from "../hooks";
import { PostImage } from "./post-image";

interface PostGridProps {
  result: InfinitePostsResult;
  empty: React.ReactNode;
}

// 3-column image grid with infinite scroll (profile Gallery / Saved / Likes)
export function PostGrid({ result, empty }: PostGridProps) {
  const {
    posts,
    isLoading,
    isError,
    error,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = result;

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const sentinelRef = useOnVisible<HTMLDivElement>(
    loadMore,
    Boolean(hasNextPage),
  );

  if (isLoading) {
    return (
      <ul className="grid animate-pulse grid-cols-3 gap-0.5 px-4 md:gap-1 md:px-0">
        {Array.from({ length: 9 }).map((_, i) => (
          <li key={i} className="aspect-square rounded-md bg-neutral-900" />
        ))}
      </ul>
    );
  }

  if (isError) {
    return (
      <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
    );
  }

  if (posts.length === 0) return <>{empty}</>;

  return (
    <>
      <ul className="grid grid-cols-3 gap-0.5 px-4 md:gap-1 md:px-0">
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/posts/${post.id}`} className="block">
              <PostImage
                src={post.imageUrl}
                alt={post.caption || `Post by ${post.author.username}`}
                sizes="(min-width: 768px) 270px, 33vw"
              />
            </Link>
          </li>
        ))}
      </ul>
      <div ref={sentinelRef} className="flex justify-center py-4">
        {isFetchingNextPage && (
          <Loader2 className="size-6 animate-spin text-neutral-400" />
        )}
      </div>
    </>
  );
}

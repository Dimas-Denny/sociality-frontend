"use client";

import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { feedApi } from "./api";
import { postsApi } from "@/features/posts/api";
import { queryKeys } from "@/lib/query-keys";
import { useAppSelector } from "@/store/hooks";
import type { Post } from "@/features/posts/types";

const PAGE_SIZE = 10;

// Logged in -> personal feed, logged out -> public explore
export function useHomePosts() {
  const { isAuthenticated, isReady } = useAppSelector((state) => state.auth);

  const query = useInfiniteQuery({
    queryKey: isAuthenticated ? queryKeys.feed : queryKeys.explore,
    queryFn: ({ pageParam }) => {
      const params = { page: pageParam, limit: PAGE_SIZE };
      return isAuthenticated
        ? feedApi.getFeed(params)
        : postsApi.getExplore(params);
    },
    initialPageParam: 1,
    getNextPageParam: ({ pagination }) =>
      pagination.page < pagination.totalPages ? pagination.page + 1 : undefined,
    // Wait until we know whether the user is logged in
    enabled: isReady,
  });

  // Flatten pages and drop duplicates (new posts can shift page boundaries)
  const posts = useMemo(() => {
    const map = new Map<number, Post>();
    query.data?.pages.forEach((page) =>
      page.posts.forEach((post) => map.set(post.id, post)),
    );
    return Array.from(map.values());
  }, [query.data]);

  return { ...query, posts, isAuthenticated, isReady };
}

"use client";

import { useMemo } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import type { PageParams } from "@/types/api";
import { postsApi } from "./api";
import type { Post, PostList } from "./types";

interface UseInfinitePostsOptions {
  queryKey: QueryKey;
  fetchPage: (params: PageParams) => Promise<PostList>;
  enabled?: boolean;
  pageSize?: number;
}

// Shared paging + de-duplication for every post list (grid or feed)
export function useInfinitePosts({
  queryKey,
  fetchPage,
  enabled = true,
  pageSize = 18, // 6 rows of 3 in the grid
}: UseInfinitePostsOptions) {
  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => fetchPage({ page: pageParam, limit: pageSize }),
    initialPageParam: 1,
    getNextPageParam: ({ pagination }) =>
      pagination.page < pagination.totalPages ? pagination.page + 1 : undefined,
    enabled,
  });

  const posts = useMemo(() => {
    const map = new Map<number, Post>();
    query.data?.pages.forEach((page) =>
      page.posts.forEach((post) => map.set(post.id, post)),
    );
    return Array.from(map.values());
  }, [query.data]);

  return { ...query, posts };
}

export type InfinitePostsResult = ReturnType<typeof useInfinitePosts>;

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postsApi.create,
    onSuccess: () => {
      // PDF: "after create, the post shows up in feed & my profile"
      queryClient.invalidateQueries({ queryKey: queryKeys.feed });
      queryClient.invalidateQueries({ queryKey: queryKeys.explore });
      queryClient.invalidateQueries({ queryKey: queryKeys.myPosts });
      queryClient.invalidateQueries({ queryKey: queryKeys.me, exact: true }); // post count
    },
  });
}

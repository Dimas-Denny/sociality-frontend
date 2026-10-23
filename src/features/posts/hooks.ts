"use client";

import { useMemo } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { useAppSelector } from "@/store/hooks";
import type { PageParams } from "@/types/api";
import { postsApi } from "./api";
import { cancelPostQueries, removePostEverywhere } from "./cache";
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

export function usePost(postId: number) {
  const isReady = useAppSelector((state) => state.auth.isReady);
  const isValidId = Number.isInteger(postId) && postId > 0;

  return useQuery({
    queryKey: queryKeys.postDetail(postId),
    queryFn: () => postsApi.getPost(postId),
    enabled: isReady && isValidId, // wait for the token so likedByMe is correct
    retry: false, // a 404 won't fix itself
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postsApi.deletePost,

    // PDF: "Delete removes the post from every list without a full reload"
    onMutate: async (postId) => {
      await cancelPostQueries(queryClient);
      removePostEverywhere(queryClient, postId);
    },

    // Lists were already changed, so refetch them to restore the post
    onError: (error) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.feed });
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
      toast.error(getErrorMessage(error, "Couldn't delete the post"));
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.me, exact: true }); // post count
    },
  });
}

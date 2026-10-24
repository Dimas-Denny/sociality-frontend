"use client";

import { useMemo } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { useMe } from "@/features/me/hooks";
import { updatePostEverywhere } from "@/features/posts/cache";
import { commentsApi } from "./api";
import type { Comment, CommentList } from "./types";

const PAGE_SIZE = 10;

type CommentsCache = InfiniteData<CommentList>;

export function useComments(postId: number) {
  const query = useInfiniteQuery({
    queryKey: queryKeys.comments(postId),
    queryFn: ({ pageParam }) =>
      commentsApi.getComments(postId, { page: pageParam, limit: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: ({ pagination }) =>
      pagination.page < pagination.totalPages ? pagination.page + 1 : undefined,
  });

  const comments = useMemo(() => {
    const map = new Map<number, Comment>();
    query.data?.pages.forEach((page) =>
      page.comments.forEach((c) => map.set(c.id, c)),
    );
    return Array.from(map.values());
  }, [query.data]);

  return { ...query, comments };
}

// Keep the counter on every post card in sync
function shiftCommentCount(
  queryClient: ReturnType<typeof useQueryClient>,
  postId: number,
  delta: number,
) {
  updatePostEverywhere(queryClient, postId, (post) => ({
    ...post,
    commentCount: Math.max(0, post.commentCount + delta),
  }));
}

export function useAddComment(postId: number) {
  const queryClient = useQueryClient();
  const { data: me } = useMe();
  const key = queryKeys.comments(postId);

  return useMutation({
    mutationFn: (text: string) => commentsApi.addComment(postId, text),

    onMutate: async (text) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<CommentsCache>(key);

      const optimistic: Comment = {
        id: -Date.now(), // temporary id, replaced after refetch
        text,
        createdAt: new Date().toISOString(),
        author: {
          id: me?.profile.id ?? 0,
          username: me?.profile.username ?? "you",
          name: me?.profile.name ?? "You",
          avatarUrl: me?.profile.avatarUrl ?? null,
        },
      };

      // Show it at the top of the first page right away
      queryClient.setQueryData<CommentsCache>(key, (data) =>
        data
          ? {
              ...data,
              pages: data.pages.map((page, i) =>
                i === 0
                  ? { ...page, comments: [optimistic, ...page.comments] }
                  : page,
              ),
            }
          : data,
      );
      shiftCommentCount(queryClient, postId, +1);

      return { previous };
    },

    onError: (error, _text, context) => {
      queryClient.setQueryData(key, context?.previous);
      shiftCommentCount(queryClient, postId, -1);
      toast.error(getErrorMessage(error, "Couldn't post your comment"));
    },

    // Reconcile with server truth (real id, order, timestamp)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
}

export function useDeleteComment(postId: number) {
  const queryClient = useQueryClient();
  const key = queryKeys.comments(postId);

  return useMutation({
    mutationFn: (commentId: number) => commentsApi.deleteComment(commentId),

    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<CommentsCache>(key);

      queryClient.setQueryData<CommentsCache>(key, (data) =>
        data
          ? {
              ...data,
              pages: data.pages.map((page) => ({
                ...page,
                comments: page.comments.filter((c) => c.id !== commentId),
              })),
            }
          : data,
      );
      shiftCommentCount(queryClient, postId, -1);

      return { previous };
    },

    onError: (error, _id, context) => {
      queryClient.setQueryData(key, context?.previous);
      shiftCommentCount(queryClient, postId, +1);
      toast.error(getErrorMessage(error, "Couldn't delete the comment"));
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
}

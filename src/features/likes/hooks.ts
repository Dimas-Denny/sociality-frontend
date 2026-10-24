"use client";

import { useMemo } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { useAppSelector } from "@/store/hooks";
import {
  cancelPostQueries,
  updatePostEverywhere,
} from "@/features/posts/cache";
import type { Post } from "@/features/posts/types";
import type { UserSummary } from "@/features/users/types";
import { likesApi } from "./api";

interface ToggleLikeVars {
  postId: number;
  liked: boolean;
}

// Idempotent: setting the same state twice never changes the counter
function applyLike(post: Post, liked: boolean): Post {
  if (post.likedByMe === liked) return post;
  return {
    ...post,
    likedByMe: liked,
    likeCount: Math.max(0, post.likeCount + (liked ? 1 : -1)),
  };
}

export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, liked }: ToggleLikeVars) =>
      liked ? likesApi.like(postId) : likesApi.unlike(postId),

    onMutate: async ({ postId, liked }) => {
      await cancelPostQueries(queryClient);
      updatePostEverywhere(queryClient, postId, (post) =>
        applyLike(post, liked),
      );
    },

    // Roll back if the server rejects it
    onError: (error, { postId, liked }) => {
      updatePostEverywhere(queryClient, postId, (post) =>
        applyLike(post, !liked),
      );
      toast.error(getErrorMessage(error, "Couldn't update like"));
    },

    onSettled: (_data, _error, { postId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.me, exact: true });
      queryClient.invalidateQueries({ queryKey: queryKeys.likedBy(postId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.myLikes });
    },
  });
}

const LIKED_BY_PAGE_SIZE = 20;

export function useLikedBy(postId: number) {
  const isReady = useAppSelector((state) => state.auth.isReady);

  const query = useInfiniteQuery({
    queryKey: queryKeys.likedBy(postId),
    queryFn: ({ pageParam }) =>
      likesApi.getLikedBy(postId, {
        page: pageParam,
        limit: LIKED_BY_PAGE_SIZE,
      }),
    initialPageParam: 1,
    getNextPageParam: ({ pagination }) =>
      pagination.page < pagination.totalPages ? pagination.page + 1 : undefined,
    enabled: isReady, // token needed for isFollowedByMe / isMe
  });

  const users = useMemo(() => {
    const map = new Map<number, UserSummary>();
    query.data?.pages.forEach((page) =>
      page.users.forEach((user) => map.set(user.id, user)),
    );
    return Array.from(map.values());
  }, [query.data]);

  return { ...query, users };
}

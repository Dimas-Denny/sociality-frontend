"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import {
  cancelPostQueries,
  updatePostEverywhere,
} from "@/features/posts/cache";
import type { Post } from "@/features/posts/types";
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

    // Profile stats include a likes count
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
    },
  });
}

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { useAppSelector } from "@/store/hooks";
import { savesApi } from "./api";
import { useInfinitePosts } from "@/features/posts/hooks";

const SAVED_IDS_LIMIT = 50; // API max per page

export function useSavedIds() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.savedIds,
    queryFn: async () => {
      const { posts } = await savesApi.getSaved({
        page: 1,
        limit: SAVED_IDS_LIMIT,
      });
      return posts.map((post) => post.id);
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}

interface ToggleSaveVars {
  postId: number;
  saved: boolean;
}

// Full saved list for the Saved tab (only fetched when the tab is opened)
export function useSavedPosts(enabled: boolean) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return useInfinitePosts({
    queryKey: queryKeys.savedList,
    fetchPage: savesApi.getSaved,
    enabled: isAuthenticated && enabled,
  });
}

export function useToggleSave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, saved }: ToggleSaveVars) =>
      saved ? savesApi.save(postId) : savesApi.unsave(postId),

    onMutate: async ({ postId, saved }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.savedIds });
      const previous = queryClient.getQueryData<number[]>(queryKeys.savedIds);

      // never add the same id twice
      queryClient.setQueryData<number[]>(queryKeys.savedIds, (ids = []) =>
        saved
          ? ids.includes(postId)
            ? ids
            : [...ids, postId]
          : ids.filter((id) => id !== postId),
      );

      return { previous };
    },

    onError: (error, _vars, context) => {
      queryClient.setQueryData(queryKeys.savedIds, context?.previous);
      toast.error(getErrorMessage(error, "Couldn't update saved posts"));
    },

    // The Saved page list must reflect the change next time it opens
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.savedList });
    },
  });
}

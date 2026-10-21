"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { followApi } from "./api";
import { updateUserEverywhere } from "./cache";

interface ToggleFollowVars {
  username: string;
  follow: boolean; // desired state after the click
}

export function useToggleFollow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ username, follow }: ToggleFollowVars) =>
      follow ? followApi.follow(username) : followApi.unfollow(username),

    onMutate: async ({ username, follow }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.users });
      updateUserEverywhere(queryClient, username, (user) => ({
        ...user,
        isFollowedByMe: follow,
      }));
    },

    onError: (error, { username, follow }) => {
      updateUserEverywhere(queryClient, username, (user) => ({
        ...user,
        isFollowedByMe: !follow,
      }));
      toast.error(getErrorMessage(error, "Couldn't update follow"));
    },

    onSettled: () => {
      // New/removed posts in the timeline + following count in my stats
      queryClient.invalidateQueries({ queryKey: queryKeys.feed });
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
    },
  });
}

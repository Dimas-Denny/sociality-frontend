"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import type { PublicProfile } from "@/features/profile/types";
import { followApi } from "./api";
import { updateUserEverywhere } from "./cache";

interface ToggleFollowVars {
  username: string;
  follow: boolean;
}

// Idempotent: following twice never adds 2 followers
function applyFollow(profile: PublicProfile, follow: boolean): PublicProfile {
  if (profile.isFollowing === follow) return profile;
  return {
    ...profile,
    isFollowing: follow,
    counts: {
      ...profile.counts,
      followers: Math.max(0, profile.counts.followers + (follow ? 1 : -1)),
    },
  };
}

export function useToggleFollow() {
  const queryClient = useQueryClient();

  const setFollowState = (username: string, follow: boolean) => {
    // Public profile page: button + followers counter
    queryClient.setQueryData<PublicProfile>(
      queryKeys.userProfile(username),
      (profile) => (profile ? applyFollow(profile, follow) : profile),
    );
    updateUserEverywhere(queryClient, username, (user) => ({
      ...user,
      isFollowedByMe: follow,
    }));
  };

  return useMutation({
    mutationFn: ({ username, follow }: ToggleFollowVars) =>
      follow ? followApi.follow(username) : followApi.unfollow(username),

    onMutate: async ({ username, follow }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.users });
      setFollowState(username, follow);
    },

    onError: (error, { username, follow }) => {
      setFollowState(username, !follow);
      toast.error(getErrorMessage(error, "Couldn't update follow"));
    },

    onSettled: (_data, _error, { username }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.userProfile(username),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.feed });
      queryClient.invalidateQueries({ queryKey: queryKeys.me, exact: true });
    },
  });
}

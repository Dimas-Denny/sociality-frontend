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
import type { PublicProfile } from "@/features/profile/types";
import type { UserSummary } from "@/features/users/types";
import { followApi, type FollowKind } from "./api";
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
const LIST_PAGE_SIZE = 20;

export function useFollowList(owner: string | null, kind: FollowKind) {
  const isReady = useAppSelector((state) => state.auth.isReady);

  const query = useInfiniteQuery({
    queryKey: queryKeys.followList(owner ?? "@me", kind),
    queryFn: ({ pageParam }) =>
      followApi.getList(owner, kind, {
        page: pageParam,
        limit: LIST_PAGE_SIZE,
      }),
    initialPageParam: 1,
    getNextPageParam: ({ pagination }) =>
      pagination.page < pagination.totalPages ? pagination.page + 1 : undefined,
    enabled: isReady, // token needed for correct isFollowedByMe
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

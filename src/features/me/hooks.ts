"use client";

import { meApi } from "./api";
import { queryKeys } from "@/lib/query-keys";
import { useAppSelector } from "@/store/hooks";
import { useInfinitePosts } from "@/features/posts/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useMe() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.me,
    queryFn: meApi.getMe,
    enabled: isAuthenticated, // don't call /me when logged out
  });
}

export function useMyPosts() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return useInfinitePosts({
    queryKey: queryKeys.myPosts,
    fetchPage: meApi.getMyPosts,
    enabled: isAuthenticated,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: meApi.updateMe,
    onSuccess: () => {
      // Profile, stats, and my own lists
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
      // My name/avatar appear as author on post cards & comments
      queryClient.invalidateQueries({ queryKey: queryKeys.feed });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
  });
}

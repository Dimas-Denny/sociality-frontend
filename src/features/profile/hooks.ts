"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { useAppSelector } from "@/store/hooks";
import { useInfinitePosts } from "@/features/posts/hooks";
import { profileApi } from "./api";

export function useProfile(username: string) {
  const isReady = useAppSelector((state) => state.auth.isReady);

  return useQuery({
    queryKey: queryKeys.userProfile(username),
    queryFn: () => profileApi.getProfile(username),
    enabled: isReady,
    retry: false,
  });
}

export function useUserPosts(username: string) {
  return useInfinitePosts({
    queryKey: queryKeys.userPosts(username),
    fetchPage: (params) => profileApi.getUserPosts(username, params),
  });
}

export function useUserLikes(username: string, enabled: boolean) {
  return useInfinitePosts({
    queryKey: queryKeys.userLikes(username),
    fetchPage: (params) => profileApi.getUserLikes(username, params),
    enabled,
  });
}

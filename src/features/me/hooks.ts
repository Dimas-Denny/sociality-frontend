"use client";

import { useQuery } from "@tanstack/react-query";
import { meApi } from "./api";
import { queryKeys } from "@/lib/query-keys";
import { useAppSelector } from "@/store/hooks";
import { useInfinitePosts } from "@/features/posts/hooks";

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

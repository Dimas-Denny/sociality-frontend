"use client";

import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { useAppSelector } from "@/store/hooks";
import { usersApi } from "./api";
import type { UserSummary } from "./types";

const PAGE_SIZE = 20;

export function useUserSearch(keyword: string) {
  const isReady = useAppSelector((state) => state.auth.isReady);

  const query = useInfiniteQuery({
    queryKey: queryKeys.userSearch(keyword),
    queryFn: ({ pageParam }) =>
      usersApi.search({ q: keyword, page: pageParam, limit: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: ({ pagination }) =>
      pagination.page < pagination.totalPages ? pagination.page + 1 : undefined,
    enabled: isReady && keyword.length > 0,
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

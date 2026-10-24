import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import type { UserList, UserSummary } from "@/features/users/types";

function isInfiniteUserList(data: unknown): data is InfiniteData<UserList> {
  if (!data || typeof data !== "object" || !("pages" in data)) return false;
  const { pages } = data as InfiniteData<UserList>;
  return (
    Array.isArray(pages) && pages.every((page) => Array.isArray(page?.users))
  );
}

export function updateUserEverywhere(
  queryClient: QueryClient,
  username: string,
  updater: (user: UserSummary) => UserSummary,
) {
  queryClient.setQueriesData({ queryKey: queryKeys.users }, (data: unknown) => {
    if (!isInfiniteUserList(data)) return data;
    return {
      ...data,
      pages: data.pages.map((page) => ({
        ...page,
        users: page.users.map((user) =>
          user.username === username ? updater(user) : user,
        ),
      })),
    };
  });
}

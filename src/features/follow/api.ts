import { api } from "@/lib/api";
import type { ApiResponse, PageParams, Pagination } from "@/types/api";
import type { UserList, UserSummary } from "@/features/users/types";

export type FollowKind = "followers" | "following";

interface RawUserList {
  users?: UserSummary[];
  items?: UserSummary[];
  pagination: Pagination;
}

export const followApi = {
  follow: (username: string) =>
    api.post(`/follow/${encodeURIComponent(username)}`),
  unfollow: (username: string) =>
    api.delete(`/follow/${encodeURIComponent(username)}`),

  getList: async (
    owner: string | null,
    kind: FollowKind,
    params: PageParams,
  ): Promise<UserList> => {
    const path = owner
      ? `/users/${encodeURIComponent(owner)}/${kind}`
      : `/me/${kind}`;
    const { data } = await api.get<ApiResponse<RawUserList>>(path, { params });
    return {
      users: data.data.users ?? data.data.items ?? [],
      pagination: data.data.pagination,
    };
  },
};

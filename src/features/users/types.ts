import type { Pagination } from "@/types/api";

export interface UserSummary {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
  isFollowedByMe: boolean;
}

export interface UserList {
  users: UserSummary[];
  pagination: Pagination;
}

import { api } from "@/lib/api";
import type { ApiResponse, PageParams } from "@/types/api";
import type { UserList } from "./types";

export const usersApi = {
  search: async (params: PageParams & { q: string }) => {
    const { data } = await api.get<ApiResponse<UserList>>("/users/search", {
      params,
    });
    return data.data;
  },
};

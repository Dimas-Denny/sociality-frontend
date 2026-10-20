import { api } from "@/lib/api";
import type { ApiResponse, PageParams } from "@/types/api";
import type { PostList } from "./types";

export const postsApi = {
  // Public: works with or without a token
  getExplore: async (params: PageParams) => {
    const { data } = await api.get<ApiResponse<PostList>>("/posts", { params });
    return data.data;
  },
};

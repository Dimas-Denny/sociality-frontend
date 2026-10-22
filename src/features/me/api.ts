import { api } from "@/lib/api";
import type { ApiResponse, PageParams } from "@/types/api";
import { toPostList, type RawPostList } from "@/features/posts/normalize";
import type { MeData } from "./types";

export const meApi = {
  getMe: async () => {
    const { data } = await api.get<ApiResponse<MeData>>("/me");
    return data.data;
  },

  getMyPosts: async (params: PageParams) => {
    const { data } = await api.get<ApiResponse<RawPostList>>("/me/posts", {
      params,
    });
    return toPostList(data.data);
  },
};

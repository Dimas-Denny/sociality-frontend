import { api } from "@/lib/api";
import type { ApiResponse, PageParams } from "@/types/api";
import { toPostList, type RawPostList } from "@/features/posts/normalize";
import type { MeData, UpdateProfilePayload } from "./types";

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

  updateMe: async (payload: UpdateProfilePayload) => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, value);
    });

    const { data } = await api.patch<ApiResponse<unknown>>("/me", formData);
    return data.data;
  },

  getMyLikes: async (params: PageParams) => {
    const { data } = await api.get<ApiResponse<RawPostList>>("/me/likes", {
      params,
    });
    return toPostList(data.data);
  },
};

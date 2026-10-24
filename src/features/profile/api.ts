import { api } from "@/lib/api";
import type { ApiResponse, PageParams } from "@/types/api";
import { toPostList, type RawPostList } from "@/features/posts/normalize";
import type { PublicProfile } from "./types";

const userPath = (username: string) => `/users/${encodeURIComponent(username)}`;

export const profileApi = {
  getProfile: async (username: string) => {
    const { data } = await api.get<ApiResponse<PublicProfile>>(
      userPath(username),
    );
    return data.data;
  },

  getUserPosts: async (username: string, params: PageParams) => {
    const { data } = await api.get<ApiResponse<RawPostList>>(
      `${userPath(username)}/posts`,
      {
        params,
      },
    );
    return toPostList(data.data);
  },

  getUserLikes: async (username: string, params: PageParams) => {
    const { data } = await api.get<ApiResponse<RawPostList>>(
      `${userPath(username)}/likes`,
      {
        params,
      },
    );
    return toPostList(data.data);
  },
};

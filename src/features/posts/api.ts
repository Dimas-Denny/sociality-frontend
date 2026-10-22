import { api } from "@/lib/api";
import type { ApiResponse, PageParams } from "@/types/api";
import type { Post, PostList } from "./types";

export interface CreatePostPayload {
  image: File;
  caption: string;
}

export const postsApi = {
  // Public: works with or without a token
  getExplore: async (params: PageParams) => {
    const { data } = await api.get<ApiResponse<PostList>>("/posts", { params });
    return data.data;
  },

  create: async ({ image, caption }: CreatePostPayload) => {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("caption", caption);

    const { data } = await api.post<ApiResponse<Post>>("/posts", formData);
    return data.data;
  },
};

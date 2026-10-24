import { api } from "@/lib/api";
import type { ApiResponse, Pagination, PageParams } from "@/types/api";
import type { Post, PostList } from "@/features/posts/types";

interface FeedResponse {
  items: Post[]; // feed uses "items" instead of "posts"
  pagination: Pagination;
}

export const feedApi = {
  getFeed: async (params: PageParams): Promise<PostList> => {
    const { data } = await api.get<ApiResponse<FeedResponse>>("/feed", {
      params,
    });
    // Normalize to the same shape as other post lists
    return { posts: data.data.items, pagination: data.data.pagination };
  },
};

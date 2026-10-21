import { api } from "@/lib/api";
import type { ApiResponse, PageParams, Pagination } from "@/types/api";
import type { Post, PostList } from "@/features/posts/types";

// Response shape isn't documented in Swagger, so accept the variants this API uses
type SavedItem = Post | { post: Post };

interface SavedResponse {
  posts?: SavedItem[];
  items?: SavedItem[];
  pagination: Pagination;
}

const toPost = (item: SavedItem): Post => ("post" in item ? item.post : item);

export const savesApi = {
  save: (postId: number) => api.post(`/posts/${postId}/save`),
  unsave: (postId: number) => api.delete(`/posts/${postId}/save`),

  getSaved: async (params: PageParams): Promise<PostList> => {
    const { data } = await api.get<ApiResponse<SavedResponse>>("/me/saved", {
      params,
    });
    const list = data.data.posts ?? data.data.items ?? [];
    return { posts: list.map(toPost), pagination: data.data.pagination };
  },
};

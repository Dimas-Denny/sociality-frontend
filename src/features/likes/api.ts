import { api } from "@/lib/api";
import type { ApiResponse, PageParams } from "@/types/api";
import type { UserList } from "@/features/users/types";

export const likesApi = {
  like: (postId: number) => api.post(`/posts/${postId}/like`),
  unlike: (postId: number) => api.delete(`/posts/${postId}/like`),

  getLikedBy: async (postId: number, params: PageParams) => {
    const { data } = await api.get<ApiResponse<UserList>>(
      `/posts/${postId}/likes`,
      { params },
    );
    return data.data;
  },
};

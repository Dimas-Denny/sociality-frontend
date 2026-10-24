import { api } from "@/lib/api";
import type { ApiResponse, PageParams } from "@/types/api";
import type { Comment, CommentList } from "./types";

export const commentsApi = {
  getComments: async (postId: number, params: PageParams) => {
    const { data } = await api.get<ApiResponse<CommentList>>(
      `/posts/${postId}/comments`,
      {
        params,
      },
    );
    return data.data;
  },

  addComment: async (postId: number, text: string) => {
    const { data } = await api.post<ApiResponse<Comment>>(
      `/posts/${postId}/comments`,
      { text },
    );
    return data.data;
  },

  deleteComment: (commentId: number) => api.delete(`/comments/${commentId}`),
};

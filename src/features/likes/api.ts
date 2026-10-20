import { api } from "@/lib/api";

export const likesApi = {
  like: (postId: number) => api.post(`/posts/${postId}/like`),
  unlike: (postId: number) => api.delete(`/posts/${postId}/like`),
};

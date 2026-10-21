import { api } from "@/lib/api";

export const followApi = {
  follow: (username: string) =>
    api.post(`/follow/${encodeURIComponent(username)}`),
  unfollow: (username: string) =>
    api.delete(`/follow/${encodeURIComponent(username)}`),
};

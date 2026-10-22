import type { Pagination } from "@/types/api";
import type { Post, PostList } from "./types";

export interface RawPostList {
  posts?: Post[];
  items?: Post[];
  pagination: Pagination;
}

export const toPostList = (raw: RawPostList): PostList => ({
  posts: raw.posts ?? raw.items ?? [],
  pagination: raw.pagination,
});

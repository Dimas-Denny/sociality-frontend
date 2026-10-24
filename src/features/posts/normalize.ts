import type { Pagination } from "@/types/api";
import type { Post, PostList } from "./types";

type PostItem = Post | { post: Post };

export interface RawPostList {
  posts?: PostItem[];
  items?: PostItem[];
  pagination: Pagination;
}

const unwrap = (item: PostItem): Post => ("post" in item ? item.post : item);

export const toPostList = (raw: RawPostList): PostList => ({
  posts: (raw.posts ?? raw.items ?? []).map(unwrap),
  pagination: raw.pagination,
});

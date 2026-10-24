import type { Pagination } from "@/types/api";

export interface PostAuthor {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
}

export interface Post {
  id: number;
  imageUrl: string;
  caption: string | null;
  createdAt: string;
  author: PostAuthor;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
}

// Normalized shape used by every post list in the app
export interface PostList {
  posts: Post[];
  pagination: Pagination;
}

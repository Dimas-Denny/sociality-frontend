import type { Pagination } from "@/types/api";
import type { PostAuthor } from "@/features/posts/types";

export interface Comment {
  id: number; // negative id = optimistic comment not yet saved
  text: string;
  createdAt: string;
  author: PostAuthor;
}

export interface CommentList {
  comments: Comment[];
  pagination: Pagination;
}

import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { Post, PostList } from "./types";

// Query keys that hold post data (used to cancel in-flight refetches)
export const POST_QUERY_ROOTS = [["feed"], ["posts"]] as const;

function isInfinitePostList(data: unknown): data is InfiniteData<PostList> {
  if (!data || typeof data !== "object" || !("pages" in data)) return false;
  const { pages } = data as InfiniteData<PostList>;
  return (
    Array.isArray(pages) && pages.every((page) => Array.isArray(page?.posts))
  );
}

function isPost(data: unknown): data is Post {
  return (
    !!data && typeof data === "object" && "id" in data && "likeCount" in data
  );
}

export function updatePostEverywhere(
  queryClient: QueryClient,
  postId: number,
  updater: (post: Post) => Post,
) {
  queryClient.setQueriesData({}, (data: unknown) => {
    if (isInfinitePostList(data)) {
      return {
        ...data,
        pages: data.pages.map((page) => ({
          ...page,
          posts: page.posts.map((post) =>
            post.id === postId ? updater(post) : post,
          ),
        })),
      };
    }
    if (isPost(data) && data.id === postId) return updater(data);
    return data; // unrelated query, leave untouched
  });
}

export async function cancelPostQueries(queryClient: QueryClient) {
  await Promise.all(
    POST_QUERY_ROOTS.map((queryKey) => queryClient.cancelQueries({ queryKey })),
  );
}

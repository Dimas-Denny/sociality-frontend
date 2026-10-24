import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { Post, PostList } from "./types";
import { queryKeys } from "@/lib/query-keys";

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
    return data;
  });
}

export async function cancelPostQueries(queryClient: QueryClient) {
  await Promise.all(
    POST_QUERY_ROOTS.map((queryKey) => queryClient.cancelQueries({ queryKey })),
  );
}

export function removePostEverywhere(queryClient: QueryClient, postId: number) {
  queryClient.setQueriesData({}, (data: unknown) => {
    if (!isInfinitePostList(data)) return data;
    return {
      ...data,
      pages: data.pages.map((page) => ({
        ...page,
        posts: page.posts.filter((post) => post.id !== postId),
      })),
    };
  });

  queryClient.setQueryData<number[]>(queryKeys.savedIds, (ids) =>
    ids?.filter((id) => id !== postId),
  );
}

export function findPostInCache(
  queryClient: QueryClient,
  postId: number,
): Post | undefined {
  for (const [, data] of queryClient.getQueriesData({})) {
    if (isInfinitePostList(data)) {
      for (const page of data.pages) {
        const found = page.posts.find((post) => post.id === postId);
        if (found) return found;
      }
    } else if (isPost(data) && data.id === postId) {
      return data;
    }
  }
  return undefined;
}

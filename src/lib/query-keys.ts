export const queryKeys = {
  me: ["me"] as const,
  feed: ["feed"] as const,
  explore: ["posts", "explore"] as const,

  savedIds: ["me", "saved", "ids"] as const,
  savedList: ["me", "saved", "list"] as const,

  users: ["users"] as const,
  userSearch: (keyword: string) => ["users", "search", keyword] as const,

  comments: (postId: number) => ["posts", postId, "comments"] as const,
};

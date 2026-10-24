export const queryKeys = {
  me: ["me"] as const,
  feed: ["feed"] as const,
  explore: ["posts", "explore"] as const,

  savedIds: ["me", "saved", "ids"] as const,
  savedList: ["me", "saved", "list"] as const,

  users: ["users"] as const,
  userSearch: (keyword: string) => ["users", "search", keyword] as const,

  comments: (postId: number) => ["posts", postId, "comments"] as const,

  myPosts: ["me", "posts"] as const,

  userProfile: (username: string) => ["users", "profile", username] as const,
  userPosts: (username: string) =>
    ["posts", "user", username, "posts"] as const,
  userLikes: (username: string) =>
    ["posts", "user", username, "likes"] as const,

  followList: (owner: string, kind: "followers" | "following") =>
    ["users", kind, owner] as const,

  postDetail: (postId: number) => ["posts", "detail", postId] as const,

  likedBy: (postId: number) => ["users", "liked-by", postId] as const,
};

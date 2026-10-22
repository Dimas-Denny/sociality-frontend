export interface PublicProfile {
  id: number;
  name: string;
  username: string;
  bio: string | null;
  avatarUrl: string | null;
  counts: {
    post: number;
    followers: number;
    following: number;
    likes: number;
  };
  isFollowing: boolean;
  isMe: boolean;
}

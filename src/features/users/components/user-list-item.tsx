"use client";

import Link from "next/link";
import { UserAvatar } from "@/components/shared/user-avatar";
import { FollowButton } from "@/features/follow/components/follow-button";
import { useMe } from "@/features/me/hooks";
import type { UserSummary } from "../types";

export function UserListItem({ user }: { user: UserSummary }) {
  const { data: me } = useMe();
  const isMe = me?.profile.username === user.username;

  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <Link
        href={`/profile/${user.username}`}
        className="flex min-w-0 flex-1 items-center gap-3"
      >
        <UserAvatar src={user.avatarUrl} name={user.name} size={48} />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">{user.name}</p>
          <p className="truncate text-sm text-neutral-400">@{user.username}</p>
        </div>
      </Link>

      {/* You can't follow yourself */}
      {!isMe && (
        <FollowButton
          username={user.username}
          isFollowing={user.isFollowedByMe}
        />
      )}
    </li>
  );
}

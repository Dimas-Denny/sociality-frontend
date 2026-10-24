import Link from "next/link";
import { UserAvatar } from "@/components/shared/user-avatar";
import type { UserSummary } from "../types";

interface UserListItemProps {
  user: UserSummary;
  // Optional right-side slot, e.g. <FollowButton /> in followers/following lists
  action?: React.ReactNode;
}

export function UserListItem({ user, action }: UserListItemProps) {
  return (
    <li className="flex items-center gap-3 px-4 py-3 md:px-0">
      <Link
        href={`/profile/${user.username}`}
        className="flex min-w-0 flex-1 items-center gap-2"
      >
        <UserAvatar src={user.avatarUrl} name={user.name} size={48} />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">{user.name}</p>
          <p className="truncate text-sm text-neutral-400">{user.username}</p>
        </div>
      </Link>

      {action}
    </li>
  );
}

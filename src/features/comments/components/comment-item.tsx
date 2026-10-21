import Link from "next/link";
import { Trash2 } from "lucide-react";
import { UserAvatar } from "@/components/shared/user-avatar";
import { fromNow } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { Comment } from "../types";

interface CommentItemProps {
  comment: Comment;
  canDelete: boolean;
  onDelete: () => void;
}

export function CommentItem({
  comment,
  canDelete,
  onDelete,
}: CommentItemProps) {
  const { author } = comment;
  const isPending = comment.id < 0; // optimistic, not saved yet
  const profileHref = `/profile/${author.username}`;

  return (
    <li
      className={cn(
        "flex flex-col gap-2 border-b border-neutral-900 py-3 last:border-b-0",
        isPending && "opacity-60",
      )}
    >
      <div className="flex items-center gap-2">
        <Link href={profileHref}>
          <UserAvatar src={author.avatarUrl} name={author.name} size={40} />
        </Link>
        <div className="min-w-0 flex-1">
          <Link href={profileHref} className="block truncate text-sm font-bold">
            {author.name}
          </Link>
          <p className="text-xs text-neutral-400 capitalize">
            {isPending ? "Posting..." : fromNow(comment.createdAt)}
          </p>
        </div>

        {canDelete && !isPending && (
          <button
            type="button"
            onClick={onDelete}
            aria-label="Delete comment"
            className="p-1 text-neutral-500 transition-colors hover:text-accent-red"
          >
            <Trash2 className="size-4" />
          </button>
        )}
      </div>

      <p className="text-sm wrap-break-word whitespace-pre-line">
        {comment.text}
      </p>
    </li>
  );
}

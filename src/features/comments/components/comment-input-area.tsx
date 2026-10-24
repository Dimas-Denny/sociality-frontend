"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { CommentComposer } from "./comment-composer";

export function CommentInputArea({ postId }: { postId: number }) {
  const pathname = usePathname();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (isAuthenticated) return <CommentComposer postId={postId} />;

  return (
    <div className="border-t border-neutral-900 p-4 text-center">
      <Link
        href={`/login?returnTo=${encodeURIComponent(pathname)}`}
        className="text-sm font-bold text-primary-200"
      >
        Log in to add a comment
      </Link>
    </div>
  );
}

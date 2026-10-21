"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { cn } from "@/lib/utils";
import { useToggleFollow } from "../hooks";

interface FollowButtonProps {
  username: string;
  isFollowing: boolean;
  className?: string;
}

export function FollowButton({
  username,
  isFollowing,
  className,
}: FollowButtonProps) {
  const requireAuth = useRequireAuth();
  const toggleFollow = useToggleFollow();

  const handleClick = () =>
    requireAuth(() => {
      if (toggleFollow.isPending) return; // ignore rapid clicks
      toggleFollow.mutate({ username, follow: !isFollowing });
    });

  return (
    <Button
      type="button"
      onClick={handleClick}
      aria-pressed={isFollowing}
      className={cn(
        "h-10 shrink-0 rounded-full px-4 text-sm font-bold",
        isFollowing
          ? "border border-neutral-900 bg-transparent text-neutral-25 hover:bg-neutral-900"
          : "bg-primary-300 text-neutral-25 hover:bg-primary-200",
        className,
      )}
    >
      {isFollowing ? (
        <>
          <Check className="size-4" />
          Following
        </>
      ) : (
        "Follow"
      )}
    </Button>
  );
}

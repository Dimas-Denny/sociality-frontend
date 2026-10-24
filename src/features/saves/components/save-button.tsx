"use client";

import { Bookmark } from "lucide-react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { cn } from "@/lib/utils";
import { useSavedIds, useToggleSave } from "../hooks";

export function SaveButton({ postId }: { postId: number }) {
  const requireAuth = useRequireAuth();
  const { data: savedIds = [] } = useSavedIds();
  const toggleSave = useToggleSave();
  const isSaved = savedIds.includes(postId);

  const handleClick = () =>
    requireAuth(() => {
      if (toggleSave.isPending) return;
      toggleSave.mutate({ postId, saved: !isSaved });
    });

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isSaved ? "Unsave post" : "Save post"}
      aria-pressed={isSaved}
    >
      <Bookmark
        className={cn(
          "size-6 transition-transform active:scale-90",
          isSaved && "fill-neutral-25",
        )}
      />
    </button>
  );
}

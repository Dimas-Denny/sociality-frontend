"use client";

import { useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import { BottomSheet } from "@/components/shared/bottom-sheet";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeComments } from "@/store/slices/ui-slice";
import { CommentsPanel } from "./comments-panel";
import { PostCommentsModal } from "./post-comments-modal";

export function CommentsSheet() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const target = useAppSelector((state) => state.ui.commentsTarget);
  const isDesktop = useMediaQuery("(min-width: 768px)"); // Tailwind "md"

  const close = useCallback(() => dispatch(closeComments()), [dispatch]);

  useEffect(() => {
    close();
  }, [pathname, close]);

  return (
    <BottomSheet
      open={!!target}
      onClose={close}
      title="Comments"
      size={isDesktop ? "wide" : "default"}
    >
      {target &&
        (isDesktop ? (
          <PostCommentsModal postId={target.postId} />
        ) : (
          <CommentsPanel
            postId={target.postId}
            postAuthorId={target.postAuthorId}
          />
        ))}
    </BottomSheet>
  );
}

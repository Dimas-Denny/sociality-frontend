"use client";

import { useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import { BottomSheet } from "@/components/shared/bottom-sheet";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeComments } from "@/store/slices/ui-slice";
import { CommentsPanel } from "./comments-panel";

// One global sheet; which post it shows comes from Redux
export function CommentsSheet() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const target = useAppSelector((state) => state.ui.commentsTarget);

  const close = useCallback(() => dispatch(closeComments()), [dispatch]);

  useEffect(() => {
    close();
  }, [pathname, close]);

  return (
    <BottomSheet open={!!target} onClose={close} title="Comments">
      {target && (
        <CommentsPanel
          postId={target.postId}
          postAuthorId={target.postAuthorId}
        />
      )}
    </BottomSheet>
  );
}

"use client";

import { useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import { BottomSheet } from "@/components/shared/bottom-sheet";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeLikedBy } from "@/store/slices/ui-slice";
import { LikedByList } from "./liked-by-list";

export function LikedBySheet() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const postId = useAppSelector((state) => state.ui.likedByPostId);

  const close = useCallback(() => dispatch(closeLikedBy()), [dispatch]);

  // Close when navigating away (e.g. tapping a user)
  useEffect(() => {
    close();
  }, [pathname, close]);

  return (
    <BottomSheet open={postId !== null} onClose={close} title="Liked by">
      {postId !== null && <LikedByList postId={postId} />}
    </BottomSheet>
  );
}

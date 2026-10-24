"use client";

import { CommentsSheet } from "@/features/comments/components/comments-sheet";
import { LikedBySheet } from "@/features/likes/components/liked-by-sheet";

export function GlobalSheets() {
  return (
    <>
      <CommentsSheet />
      <LikedBySheet />
    </>
  );
}

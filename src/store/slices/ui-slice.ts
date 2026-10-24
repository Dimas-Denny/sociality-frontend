import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface CommentsTarget {
  postId: number;
  postAuthorId: number; // post owner may delete any comment on their post
}

interface UiState {
  commentsTarget: CommentsTarget | null; // null = comments sheet closed
  likedByPostId: number | null; // null = "Liked by" sheet closed
}

const initialState: UiState = {
  commentsTarget: null,
  likedByPostId: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openComments(state, action: PayloadAction<CommentsTarget>) {
      state.commentsTarget = action.payload;
    },
    closeComments(state) {
      state.commentsTarget = null;
    },
    openLikedBy(state, action: PayloadAction<number>) {
      state.likedByPostId = action.payload;
    },
    closeLikedBy(state) {
      state.likedByPostId = null;
    },
  },
});

export const { openComments, closeComments, openLikedBy, closeLikedBy } =
  uiSlice.actions;
export default uiSlice.reducer;

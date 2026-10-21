import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface CommentsTarget {
  postId: number;
  postAuthorId: number; // post owner may delete any comment on their post
}

interface UiState {
  commentsTarget: CommentsTarget | null; // null = comments sheet closed
}

const initialState: UiState = {
  commentsTarget: null,
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
  },
});

export const { openComments, closeComments } = uiSlice.actions;
export default uiSlice.reducer;

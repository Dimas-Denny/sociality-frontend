import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  // false until we've checked the cookie on the client,
  // prevents the auth guard from redirecting too early
  isReady: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isReady: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateAuth(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
      state.isReady = true;
    },
    loggedIn(state) {
      state.isAuthenticated = true;
    },
    loggedOut(state) {
      state.isAuthenticated = false;
    },
  },
});

export const { hydrateAuth, loggedIn, loggedOut } = authSlice.actions;
export default authSlice.reducer;

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth-slice";

// Factory function: Next.js needs a fresh store per request/client
export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

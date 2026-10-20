"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "./api";
import { setToken, removeToken } from "@/lib/token";
import { queryKeys } from "@/lib/query-keys";
import { useAppDispatch } from "@/store/hooks";
import { loggedIn, loggedOut } from "@/store/slices/auth-slice";
import type { AuthData } from "./types";

// Shared success handler: save token, flip auth state, refresh profile
function useOnAuthSuccess() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return ({ token }: AuthData) => {
    setToken(token);
    dispatch(loggedIn());
    queryClient.invalidateQueries({ queryKey: queryKeys.me });
  };
}

export function useLogin() {
  const onSuccess = useOnAuthSuccess();
  return useMutation({ mutationFn: authApi.login, onSuccess });
}

// Register returns a token too, so the user is logged in right away
export function useRegister() {
  const onSuccess = useOnAuthSuccess();
  return useMutation({ mutationFn: authApi.register, onSuccess });
}

// Stay on the current page; the header switches to the guest menu.
// Private pages will be handled by the auth guard later.
export function useLogout() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return () => {
    removeToken();
    dispatch(loggedOut());
    queryClient.removeQueries({ queryKey: queryKeys.me });
    // Refetch active queries as guest (e.g. likedByMe becomes false)
    queryClient.invalidateQueries();
  };
}

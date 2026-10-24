"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { hydrateAuth } from "@/store/slices/auth-slice";
import { getToken, isTokenExpired, removeToken } from "@/lib/token";
import { onUnauthorized } from "@/lib/auth-events";
import { useLogout } from "@/features/auth/hooks";

export function AuthInitializer() {
  const dispatch = useAppDispatch();
  const logout = useLogout();

  useEffect(() => {
    const token = getToken();
    const isValid = Boolean(token) && !isTokenExpired(token!);
    if (token && !isValid) removeToken();
    dispatch(hydrateAuth(isValid));
  }, [dispatch]);

  useEffect(() => {
    return onUnauthorized(() => {
      logout();
      toast.error("Your session has expired. Please log in again.", {
        id: "session-expired",
      });
    });
  }, [logout]);

  return null;
}

"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { hydrateAuth } from "@/store/slices/auth-slice";
import { getToken } from "@/lib/token";

// Reads the token cookie once on mount so a refresh keeps the user signed in
export function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hydrateAuth(Boolean(getToken())));
  }, [dispatch]);

  return null;
}

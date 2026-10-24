"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

export function useRequireAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return (action: () => void) => {
    if (isAuthenticated) {
      action();
      return;
    }
    router.push(`/login?returnTo=${encodeURIComponent(pathname)}`);
  };
}

"use client";

import { useRouter } from "next/navigation";
import { canGoBackInApp } from "@/lib/navigation-history";

export function useGoBack(fallback = "/") {
  const router = useRouter();

  return () => {
    if (canGoBackInApp()) router.back();
    else router.push(fallback);
  };
}

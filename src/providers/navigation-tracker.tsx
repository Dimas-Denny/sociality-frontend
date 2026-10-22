"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { recordPageVisit } from "@/lib/navigation-history";

export function NavigationTracker() {
  const pathname = usePathname();

  useEffect(() => {
    recordPageVisit(pathname);
  }, [pathname]);

  return null;
}

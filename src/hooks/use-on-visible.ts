"use client";

import { useEffect, useRef } from "react";

// Returns a ref; `callback` runs when that element scrolls into view
export function useOnVisible<T extends HTMLElement>(
  callback: () => void,
  enabled = true,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) callback();
      },
      { rootMargin: "400px" }, // start loading a bit before reaching the bottom
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [callback, enabled]);

  return ref;
}

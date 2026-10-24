"use client";

import { useState } from "react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { makeStore } from "@/store";
import { AuthInitializer } from "./auth-initializer";
import { Toaster } from "sonner";
import { NavigationTracker } from "./navigation-tracker";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function Providers({ children }: { children: React.ReactNode }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [store] = useState(() => makeStore());
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthInitializer />
        <NavigationTracker />
        {children}
        <Toaster
          theme="dark"
          position={isDesktop ? "top-right" : "top-center"}
          richColors
        />
      </QueryClientProvider>
    </Provider>
  );
}

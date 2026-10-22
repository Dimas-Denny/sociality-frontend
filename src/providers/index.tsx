"use client";

import { useState } from "react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { makeStore } from "@/store";
import { AuthInitializer } from "./auth-initializer";
import { Toaster } from "sonner";
import { NavigationTracker } from "./navigation-tracker";

export default function Providers({ children }: { children: React.ReactNode }) {
  // useState initializer = created once per client, never recreated on re-render
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
        <Toaster theme="dark" position="top-center" richColors />
      </QueryClientProvider>
    </Provider>
  );
}

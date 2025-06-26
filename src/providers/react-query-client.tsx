"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { QueryClientConfig } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const config: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30 * 30, // 30 minutes
      refetchInterval: 1000 * 30 * 30, // 30 minutes
      refetchOnWindowFocus: true,
    },
  },
};

export default function ReactQueryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient(config));

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </QueryClientProvider>
  );
}
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const client = new QueryClient({
  // defaultOptions: {
  //   queries: {
  //     staleTime: Infinity,
  //   },
  // },
});

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={client}>
      {children}

      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  );
}

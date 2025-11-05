'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { queryClient } from '@/utils/orpc';
import { ThemeProvider } from './theme-provider';
import { Toaster } from './ui/sonner';

// Lazy-load React Query Devtools only on the client in development
const ReactQueryDevtools = dynamic(
  () =>
    import('@tanstack/react-query-devtools').then(
      (mod) => mod.ReactQueryDevtools
    ),
  { ssr: false }
);

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
    >
      <QueryClientProvider client={queryClient}>
        {children}
        {process.env.NODE_ENV === 'development' ? (
          <ReactQueryDevtools initialIsOpen={false} />
        ) : null}
      </QueryClientProvider>
      <Toaster richColors />
    </ThemeProvider>
  );
}

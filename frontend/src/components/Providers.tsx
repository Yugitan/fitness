'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#f5f5f0',
            border: '1px solid #2a2a2a',
            borderRadius: '12px',
            fontSize: '14px',
          },
          duration: 3000,
        }}
      />
    </QueryClientProvider>
  );
}

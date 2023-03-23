import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import 'tailwindcss/tailwind.css'
import { ReactQueryDevtools } from 'react-query/devtools'

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

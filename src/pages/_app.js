import * as React from "react";
import { useState, useEffect } from "react";
import { HydrationBoundary, QueryClientProvider } from "@tanstack/react-query";
import ClientOnlyToaster from "@/components/toast";
import { SessionProvider, useSession, signOut } from "next-auth/react";
import reactQueryClient from "@/config/react-query";
import "@/styles/globals.css";
// import "@/styles/loader.css";

function SessionErrorHandler() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signOut({ callbackUrl: "http://10.20.6.139:8080" });
    }
  }, [session]);

  return null;
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const [queryClient] = useState(() => reactQueryClient);

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={pageProps?.dehydratedState}>
          <SessionErrorHandler />
          <Component {...pageProps} />

          <ClientOnlyToaster />
        </HydrationBoundary>
      </QueryClientProvider>
    </SessionProvider>
  );
}

import "../styles/globals.css";
import "../styles/react-select.css";
import { Toaster } from "@/components/ui/toaster";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <title>Ukay.dev | Frontend Developer | Fullstack Developer</title>
      </Head>
      <Component {...pageProps} />
      <Toaster />
    </QueryClientProvider>
  );
}

export default MyApp;

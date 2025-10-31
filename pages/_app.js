import "../styles/globals.css";
import "../styles/react-select.css";
import { Toaster } from "@/components/ui/toaster";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Ukay.dev | Frontend Developer | Fullstack Developer</title>
      </Head>
      <Component {...pageProps} />
      <Toaster />
    </>
  );
}

export default MyApp;

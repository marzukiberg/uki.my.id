import "../styles/globals.css";
import "../styles/react-select.css";
import { Toaster } from "@/components/ui/toaster";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Toaster />
    </>
  );
}

export default MyApp;

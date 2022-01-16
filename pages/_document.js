import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Quicksand:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <meta
          name="description"
          content="Marzuki - Frontend Engineer from Indonesia, self experienced as a frontend engineer with more than 10 projects."
        />
        <meta
          name="keywords"
          content="web developer, frontend developer, frontend programmer, frontend master, jasa pembuatan website, web programming service"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600;700&family=Poppins:wght@400;600;700&family=Quicksand:wght@400;700&family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <meta
          name="description"
          content="Portfolio of Ukay, a Frontend and Fullstack Developer from Indonesia. Offering web development services, website creation, programming solutions, and more than 10 completed projects."
        />
        <meta
          name="keywords"
          content="web developer, frontend developer, fullstack developer, frontend programmer, fullstack programmer, jasa pembuatan website, web programming service, portfolio developer"
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

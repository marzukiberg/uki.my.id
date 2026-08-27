import Head from "next/head";
import Navbar from "../../components/v3/Navbar";
import Hero from "../../components/v3/Hero";
import ProjectGrid from "../../components/v3/ProjectGrid";
import Footer from "../../components/v3/Footer";

/* eslint-disable react/no-danger */
const directionContract = `
  impeccable:direction-contract v1
  THESIS: Swiss precision portfolio — the grid is the structure, the colorful brand letters are the only personality. Refuses the Google-Search metaphor of v2 and the card-glow AI default.
  OWN-WORLD: near-white ground #fafafa, near-black type #0a0a0a, hairline zinc borders; IBM Plex Sans for display, IBM Plex Mono for metadata and labels; the red-yellow-blue-green Ukay.dev letters are the singular color moment on an otherwise monochrome world.
  FIRST-VIEWPORT: oversized multicolor Ukay.dev wordmark centered on a faint engineering grid that drifts with the pointer; mono uppercase role line beneath; two CTAs, View Work and Resume.
  SIGNATURE: the pointer-reactive engineering grid in the hero — the page responds to presence before any click.
  PROOF: live and archived project counts rendered as typographic stats; every active project links out.
`;

const V3Index = () => {
  return (
    <div id="main" className="min-h-screen bg-[#fafafa] text-zinc-900 antialiased">
      <Head>
        <title>Ukay.dev | Frontend Engineer &amp; Fullstack Developer</title>
        <meta
          name="description"
          content="Marzuki — Frontend engineer and fullstack developer based in Indonesia. Building performant web applications with React, Next.js, and TypeScript."
        />
      </Head>

      {/* Direction contract survives the production build as a DOM comment */}
      <script
        type="text/plain"
        data-impeccable-contract
        dangerouslySetInnerHTML={{ __html: directionContract }}
        hidden
      />

      <Navbar />
      <Hero />
      <ProjectGrid />
      <Footer />
    </div>
  );
};

export default V3Index;

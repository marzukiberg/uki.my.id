import Head from "next/head";
import Navbar from "../../components/v3/Navbar";
import Footer from "../../components/v3/Footer";

/* ------------------------------------------------------------------
 * Optional v3 sections — resolved lazily so a missing component file
 * degrades to an on-brand placeholder instead of breaking the build.
 * ------------------------------------------------------------------ */
const loadOptionalSection = (name) => {
  try {
    const mod = require(`../../components/v3/${name}`);
    return mod && mod.default ? mod.default : null;
  } catch {
    return null;
  }
};

const AboutSection = loadOptionalSection("About");
const TechStackSection = loadOptionalSection("TechStack");

/* Swiss fallback slot — visible only while the real component is absent */
const SectionPlaceholder = ({ index, title, note }) => (
  <section className="max-w-5xl mx-auto px-6">
    <div className="py-20 md:py-24">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
        {index}
      </p>
      <h2 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900">
        {title}
      </h2>
      <div className="mt-8 border-t border-dashed border-zinc-200 pt-6">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-zinc-300">
          {note}
        </p>
      </div>
    </div>
  </section>
);

const AboutPage = () => {
  return (
    <div id="main" className="min-h-screen bg-[#fafafa] text-zinc-900 antialiased">
      <Head>
        <title>Ukay.dev | About</title>
        <meta
          name="description"
          content="About Marzuki — frontend engineer and fullstack developer based in Indonesia. Background, approach, and the tools behind the work."
        />
      </Head>

      <Navbar />

      {/* pt-14 clears the fixed h-14 navbar */}
      <main className="pt-14">
        {AboutSection ? (
          <AboutSection />
        ) : (
          <SectionPlaceholder
            index="01 &mdash; Profile"
            title="About"
            note="Component pending &mdash; components/v3/About"
          />
        )}

        <div className="max-w-5xl mx-auto px-6">
          <hr className="border-t border-zinc-200" />
        </div>

        {TechStackSection ? (
          <TechStackSection />
        ) : (
          <SectionPlaceholder
            index="02 &mdash; Toolbox"
            title="Tech Stack"
            note="Component pending &mdash; components/v3/TechStack"
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;

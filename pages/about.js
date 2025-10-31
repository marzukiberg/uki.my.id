import Head from "next/head";
import { useState } from "react";
import SearchLayout from "../components/SearchLayout";
import { About } from "../components/organisms";
import Portfolio from "../components/organisms/Portfolio";

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState("Semua");

  return (
    <>
      <Head>
        <title>Ukay.dev | About</title>
      </Head>
      <SearchLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        <About />
        <hr className="my-8" />
        <Portfolio />
      </SearchLayout>
    </>
  );
};

export default AboutPage;
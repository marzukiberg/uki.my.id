import Head from "next/head";
import { useState } from "react";
import AppLayout from "../components/AppLayout";
import { About } from "../components/organisms";
import Portfolio from "../components/organisms/Portfolio";

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState("Semua");

  return (
    <>
      <Head>
        <title>Ukay.dev | About</title>
      </Head>
      <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        <About />
        <hr className="my-8" />
        <Portfolio />
      </AppLayout>
    </>
  );
};

export default AboutPage;

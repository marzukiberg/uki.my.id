import Head from "next/head";
import AppLayout from "../components/AppLayout";
import PortfolioGrid from "../components/organisms/Portfolio/PortfolioGrid";
import { useState } from "react";

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState("Portfolio");

  return (
    <>
      <Head>
        <title>Ukay.dev | Portfolio</title>
      </Head>
      <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        <PortfolioGrid />
      </AppLayout>
    </>
  );
}

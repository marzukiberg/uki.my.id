import Head from "next/head";
import React, { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../../components/v2/Navbar";
import SearchSection from "../../components/v2/SearchSection";
import PortfolioShowcase from "../../components/v2/PortfolioShowcase";
import Footer from "../../components/v2/Footer";

const V2Index = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("I'm a Frontend Developer");
  const [portfolioLimit, setPortfolioLimit] = useState(8);
  const handleSearch = (e) => {
    e.preventDefault();
    router.push('/about');
  };

  const handleFeelingLucky = () => {
    router.push('/about');
  };

  return (
    <div id="main" className="min-h-screen bg-white" style={{ fontFamily: 'Roboto, sans-serif' }}>
      <Head>
        <title>Ukay.dev | Frontend Developer | Fullstack Developer</title>
      </Head>

      <Navbar router={router} />

      <SearchSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        handleFeelingLucky={handleFeelingLucky}
      />

      <PortfolioShowcase
        portfolioLimit={portfolioLimit}
        setPortfolioLimit={setPortfolioLimit}
      />

      <Footer />
    </div>
  );
};

export default V2Index;
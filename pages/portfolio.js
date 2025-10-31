import Head from 'next/head';
import SearchLayout from '../components/SearchLayout';
import PortfolioGrid from '../components/organisms/Portfolio/PortfolioGrid';
import { useState } from 'react';

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState('Portfolio');

  return (
    <>
      <Head>
        <title>Ukay.dev | Portfolio</title>
      </Head>
      <SearchLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        <PortfolioGrid />
      </SearchLayout>
    </>
  );
}

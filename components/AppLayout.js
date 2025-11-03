import React from "react";
import Head from "next/head";
import Script from "next/script";
import SearchHeader from "./SearchHeader";
import { SITE_CONFIG } from "../lib/constants";

const AppLayout = ({ children, activeTab, setActiveTab, meta = {} }) => {
  const tabs = [
    { label: "Semua", href: "/about" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Tools", href: "/tools" },
  ];

  // Default meta values
  const {
    title = SITE_CONFIG.name,
    description = SITE_CONFIG.description,
    keywords = "",
    ogImage = `${SITE_CONFIG.url}/img/og-image.jpg`,
    canonicalPath = "",
  } = meta;

  const fullTitle = title.includes(SITE_CONFIG.name)
    ? title
    : `${title} | ${SITE_CONFIG.name}`;
  const canonicalUrl = `${SITE_CONFIG.url}${canonicalPath}`;

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        {keywords && <meta name="keywords" content={keywords} />}
        <meta name="robots" content="index, follow" />
        <meta name="author" content={SITE_CONFIG.author} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content={SITE_CONFIG.name} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content={fullTitle} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={ogImage} />

        {/* Additional SEO */}
        {canonicalPath && <link rel="canonical" href={canonicalUrl} />}
        <meta name="theme-color" content={SITE_CONFIG.themeColor} />
      </Head>

      <Script
        src="//pl27916297.effectivegatecpm.com/c0/28/07/c028076d225d26dcc3f66fedb.js"
        strategy="afterInteractive"
      />

      <div
        className="min-h-screen bg-white"
        style={{ fontFamily: "Roboto, sans-serif" }}
      >
        {/* Header */}
        <SearchHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={tabs}
        />

        {/* Content */}
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </div>
    </>
  );
};

export default AppLayout;

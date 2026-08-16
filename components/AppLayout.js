import React from "react";
import Head from "next/head";
import Script from "next/script";
import SearchHeader from "./SearchHeader";
import { SITE_CONFIG } from "../lib/constants";
import ChatFloatingButton from "./ui/ChatFloatingButton";

const AppLayout = ({ children, activeTab, setActiveTab, meta = {} }) => {
  const tabs = [
    { label: "Semua", href: "/" },
    { label: "Works", href: "/works" },
    { label: "Portfolio", href: "/portfolio" },
  ];

  // Default meta values
  const {
    title = "Marzuki | Frontend Developer & Fullstack Developer",
    description = SITE_CONFIG.description,
    keywords = "Marzuki, Frontend Developer, Fullstack Developer, React, Next.js, TypeScript, Tailwind CSS, Web Developer Indonesia, Software Engineer",
    ogImage = "https://res.cloudinary.com/uki14/image/upload/v1747900962/frontendonesia/projects/pdfmu/p4rnpx89oekhlsjblqym.png",
    canonicalPath = "",
  } = meta;

  const fullTitle = title.includes("Marzuki")
    ? title
    : `${title} | Marzuki - Frontend Developer`;
  const canonicalUrl = `${SITE_CONFIG.url}${canonicalPath}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Marzuki",
    alternateName: ["Ukay", "Ukay.dev"],
    url: "https://ukay.dev",
    image: "https://ukay.dev/img/profile.jpeg",
    jobTitle: "Frontend Developer & Fullstack Engineer",
    worksFor: {
      "@type": "Organization",
      name: "Assist.id",
    },
    sameAs: [
      "https://github.com/marzukiberg",
      "https://www.linkedin.com/in/marzukiberg/",
    ],
    knowsAbout: [
      "React.js",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Node.js",
      "Fullstack Web Development",
      "Web Performance",
    ],
    description: description,
  };

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="author" content="Marzuki" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content="Marzuki Portfolio" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={canonicalUrl} />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />

        {/* JSON-LD Structured Data for Google Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <meta name="theme-color" content="#1a73e8" />
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

        {/* AI Assistant Floating Action Button */}
        <ChatFloatingButton />
      </div>
    </>
  );
};

export default AppLayout;

import React from "react";
import SearchHeader from "./SearchHeader";

const SearchLayout = ({ children, activeTab, setActiveTab }) => {
  const tabs = [{ label: 'Semua', href: '/about' }, { label: 'Portfolio', href: '/portfolio' }, { label: 'Tools', href: '/tools' }];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Roboto, sans-serif' }}>
      {/* Header */}
      <SearchHeader activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default SearchLayout;
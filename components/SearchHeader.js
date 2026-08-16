import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import Brand from "./Brand";
import AppsMenuButton from "./ui/apps-menu-button";

const SearchInputForm = ({ searchQuery, setSearchQuery, handleSearch, className = "" }) => (
  <form onSubmit={handleSearch} className={`relative ${className}`}>
    <div className="flex h-11 w-full items-center rounded-full border border-gray-200 bg-white px-4 shadow-xs transition-all hover:shadow-md focus-within:shadow-md focus-within:border-transparent">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full flex-1 bg-transparent text-sm text-gray-900 focus:outline-none md:text-base"
        placeholder="Search..."
      />
      {searchQuery && (
        <button
          type="button"
          onClick={() => setSearchQuery("")}
          className="mr-2 text-gray-400 hover:text-gray-600 focus:outline-none"
          title="Clear"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
      <div className="flex items-center gap-1.5 pl-2 border-l border-gray-200">
        <button
          type="button"
          className="rounded-full p-1 text-gray-500 hover:bg-gray-100 focus:outline-none"
          title="Search by voice"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path fill="#4285f4" d="m12 15c1.66 0 3-1.34 3-3v-6c0-1.66-1.34-3-3-3s-3 1.34-3 3v6c0 1.66 1.34 3 3 3z"/>
            <path fill="#34a853" d="m11 18.08h2v3.92h-2z"/>
            <path fill="#fbbc05" d="m7.05 10.95c-.55 0-1 .45-1 1 0 3.28 2.67 5.95 5.95 5.95v-2c-2.18 0-3.95-1.77-3.95-3.95 0-.55-.45-1-1-1z"/>
            <path fill="#ea4335" d="m16.95 10.95c-.55 0-1 .45-1 1 0 2.18-1.77 3.95-3.95 3.95v2c3.28 0 5.95-2.67 5.95-5.95 0-.55-.45-1-1-1z"/>
          </svg>
        </button>
        <button
          type="button"
          className="rounded-full p-1 text-gray-500 hover:bg-gray-100 focus:outline-none"
          title="Search by image"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path fill="#4285f4" d="M12 11a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
            <path fill="#ea4335" d="M17.5 7A2.5 2.5 0 0 0 15 4.5H9A2.5 2.5 0 0 0 6.5 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2.5zM12 18.5A4.5 4.5 0 1 1 12 9.5a4.5 4.5 0 0 1 0 9z" />
            <path fill="#fbbc05" d="M19 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
            <path fill="#34a853" d="M12 16a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
          </svg>
        </button>
        <button
          type="submit"
          className="rounded-full p-1 text-blue-600 hover:bg-blue-50 focus:outline-none"
          title="Search"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </button>
      </div>
    </div>
  </form>
);

const SearchHeader = ({ activeTab, tabs }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(
    router.query.q !== undefined ? router.query.q : "I'm a Frontend Developer"
  );

  React.useEffect(() => {
    if (router.query.q !== undefined) {
      setSearchQuery(router.query.q);
    }
  }, [router.query.q]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push(`/`);
    }
  };

  const isActiveTab = (tab) => {
    const href = tab.href || (tab === "Semua" ? "/" : "/portfolio");
    if (href === "/") {
      return router.pathname === "/" || router.pathname === "/about";
    }
    return (
      router.pathname === href ||
      router.asPath.startsWith(href) ||
      activeTab === (tab.label || tab)
    );
  };

  const HeaderActions = () => (
    <div className="flex items-center space-x-3">
      <AppsMenuButton />
      <button
        onClick={() => router.push("/about")}
        className="flex h-9 w-9 items-center justify-center rounded-full p-0.5 transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        title="Google Account: Marzuki"
      >
        <Image
          src="/img/profile.jpeg"
          alt="Profile"
          width={32}
          height={32}
          className="h-8 w-8 rounded-full object-cover"
        />
      </button>
    </div>
  );

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      {/* Mobile Layout */}
      <div className="p-4 md:hidden">
        <div className="mb-3 flex items-center justify-between">
          <Link href="/">
            <Brand className="cursor-pointer text-2xl font-normal" />
          </Link>
          <HeaderActions />
        </div>
        <SearchInputForm
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 pt-5 pb-3">
          <div className="flex flex-1 items-center space-x-8">
            <Link href="/" className="flex-shrink-0">
              <Brand className="cursor-pointer text-3xl font-medium tracking-tight" />
            </Link>
            <SearchInputForm
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
              className="w-full max-w-[620px]"
            />
          </div>
          <HeaderActions />
        </div>
      </div>

      {/* Navigation Tabs - Google Style */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex space-x-6 text-sm">
          {tabs.map((tab) => {
            const tabName = tab.label || tab;
            const isActive = isActiveTab(tab);

            return (
              <Link
                key={tabName}
                href={tab.href || (tab === "Semua" ? "/" : "/portfolio")}
                className={`border-b-2 py-3 font-medium transition-colors ${
                  isActive
                    ? "border-[#1a73e8] text-[#1a73e8]"
                    : "border-transparent text-[#5f6368] hover:text-[#202124]"
                }`}
              >
                {tabName}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default SearchHeader;

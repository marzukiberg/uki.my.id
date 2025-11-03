import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import * as Icons from "lucide-react";
import Brand from "./Brand";
import AppsMenuButton from "./ui/apps-menu-button";

const SearchHeader = ({ activeTab, setActiveTab, tabs }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(
    router.query.q || "I'm a Frontend Developer"
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const tools = [
    { name: "Tools", link: "/tools" },
    { name: "TikTok Downloader", link: "/tools/tiktok-downloader" },
    { name: "YouTube Downloader", link: "/tools/youtube-downloader" },
    { name: "Instagram Downloader", link: "/tools/instagram-downloader" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/about?q=${searchQuery}`);
  };

  const isActiveTab = (tab) => {
    if (tab === "Tools") return router.pathname.startsWith("/tools");
    const href = tab.href || (tab === "Semua" ? "/about" : "/portfolio");
    return (
      router.pathname === href ||
      router.asPath.startsWith(href) ||
      activeTab === (tab.label || tab)
    );
  };

  const getTabDisplayName = (tab) => {
    if (tab === "Tools") {
      return activeTab.startsWith("TikTok Downloader") ||
        activeTab.startsWith("YouTube Downloader") ||
        activeTab.startsWith("Instagram Downloader")
        ? activeTab
        : tab;
    }
    return tab.label || tab;
  };

  const SearchForm = ({ className = "" }) => (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full rounded-full bg-gray-100 px-6 py-3 pr-32 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search..."
      />
      <div className="absolute right-4 top-1/2 flex -translate-y-1/2 transform items-center space-x-3">
        <button type="button" className="rounded-full p-2 hover:bg-gray-200">
          <Icons.Mic size={20} className="text-gray-600" />
        </button>
        <button type="button" className="rounded-full p-2 hover:bg-gray-200">
          <Icons.Camera size={20} className="text-gray-600" />
        </button>
        <button type="submit" className="rounded-full p-2 hover:bg-gray-200">
          <Icons.Search size={20} className="text-gray-600" />
        </button>
      </div>
    </form>
  );

  const HeaderActions = () => (
    <div className="flex items-center space-x-4">
      <AppsMenuButton />
      <button
        onClick={() => router.push("/about")}
        className="rounded-full p-1 hover:bg-gray-100"
      >
        <Image
          src="/img/profile.jpeg"
          alt="Profile"
          width={32}
          height={32}
          className="rounded-full object-cover"
        />
      </button>
    </div>
  );

  return (
    <header className="w-full">
      {/* Mobile Layout */}
      <div className="p-4 md:hidden">
        <div className="mb-4 flex items-center justify-between">
          <Link href="/">
            <Brand className="cursor-pointer text-2xl font-bold" />
          </Link>
          <HeaderActions />
        </div>
        <SearchForm />
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <Brand className="cursor-pointer text-2xl font-bold" />
            </Link>
            <SearchForm className="min-w-[50vw]" />
          </div>
          <HeaderActions />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex space-x-8 border-b border-gray-200">
          {tabs.map((tab) => {
            const tabName = tab.label || tab;
            const isActive = isActiveTab(tab);

            if (tabName === "Tools") {
              return (
                <div key={tabName} className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`flex items-center space-x-1 border-b-2 px-1 py-2 text-sm font-medium ${
                      isActive
                        ? "border-blue-500 text-blue-500"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <span>{getTabDisplayName(tabName)}</span>
                    <Icons.ChevronDown size={14} />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute left-0 top-full z-50 mt-1 min-w-[200px] rounded-md border border-gray-200 bg-white shadow-lg">
                      {tools.slice(1).map((tool) => (
                        <button
                          key={tool.name}
                          onClick={() => {
                            setActiveTab(tool.name);
                            router.push(tool.link);
                            setDropdownOpen(false);
                          }}
                          className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                        >
                          {tool.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={tabName}
                href={tab.href || (tab === "Semua" ? "/about" : "/portfolio")}
                className={`border-b-2 px-1 py-2 text-sm font-medium ${
                  isActive
                    ? "border-blue-500 text-blue-500"
                    : "border-transparent text-gray-500 hover:text-gray-700"
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

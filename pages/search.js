import Head from "next/head";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import * as Icons from "lucide-react";
import portfolioData from "../data/portfolio.json";
import { About } from "../components/organisms";

const Popover = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltip, setTooltip] = useState(null);
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsVisible(false);
        setTooltip(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderContent = () => {
    if (typeof content === "function") {
      return content(setTooltip);
    }
    return content;
  };

  return (
    <div className="relative" ref={popoverRef}>
      <div onClick={() => setIsVisible(!isVisible)}>{children}</div>
      {isVisible && (
        <div className="absolute right-0 z-10 mt-2 w-max rounded-lg border border-gray-200 bg-white opacity-100 shadow-lg transition-opacity duration-200 ease-in-out">
          <div className="p-6">{renderContent()}</div>
        </div>
      )}
      {tooltip && (
        <div
          className="absolute z-20 rounded-lg border border-gray-200 bg-white p-2 shadow-lg"
          style={{ top: tooltip.y, left: tooltip.x }}
        >
          <Image
            src={tooltip.img}
            alt={tooltip.title}
            width={150}
            height={100}
            className="rounded"
            unoptimized
          />
        </div>
      )}
    </div>
  );
};

const SearchPage = () => {
  const router = useRouter();
  const { q } = router.query;
  const [searchQuery, setSearchQuery] = useState(q || "");
  const [activeTab, setActiveTab] = useState("Tentang");

  const handleSearch = () => {
    // Handle search
  };

  const tabs = ["Tentang", "Portfolio", "Kontak"];

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "Roboto, sans-serif" }}
    >
      <Head>
        <title>Ukay.dev | Frontend Developer | Fullstack Developer</title>
      </Head>

      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-blue-500">Ukay.dev</h1>
          </div>
          <div className="relative mx-8 max-w-2xl flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-gray-300 px-4 py-2 pr-12 text-lg focus:border-blue-500 focus:outline-none"
              placeholder="Search..."
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 transform rounded-full p-1 hover:bg-gray-200"
              >
                <Icons.X size={18} className="text-gray-500" />
              </button>
            )}
          </div>
          <Popover
            content={(setTooltip) => (
              <div className="grid grid-cols-3 gap-4">
                {portfolioData.projects
                  .filter((p) => p.title)
                  .slice(0, 9)
                  .map((project, index) => (
                    <a
                      key={index}
                      href={
                        project.link && project.link !== "/#"
                          ? project.link
                          : "#"
                      }
                      target={
                        project.link && project.link !== "/#"
                          ? "_blank"
                          : undefined
                      }
                      rel="noopener noreferrer"
                      className={`block max-w-24 rounded-lg p-4 text-center text-sm text-gray-700 transition-colors hover:bg-gray-100 ${
                        !project.link || project.link === "/#"
                          ? "pointer-events-none cursor-default"
                          : ""
                      }`}
                      onMouseEnter={(e) =>
                        setTooltip({
                          img: project.img,
                          title: project.title,
                          x: e.clientX + 10,
                          y: e.clientY + 10,
                        })
                      }
                      onMouseLeave={() => setTooltip(null)}
                    >
                      <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200">
                        {React.createElement(
                          Icons[project.icon] || Icons.Circle,
                          { size: 24, className: "text-gray-700" }
                        )}
                      </div>
                      <div className="break-words text-xs leading-tight">
                        {project.title}
                      </div>
                    </a>
                  ))}
              </div>
            )}
          >
            <button className="rounded-full p-2 hover:bg-gray-100">
              <svg
                className="h-6 w-6 text-gray-700"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="6" cy="6" r="1.5" />
                <circle cx="12" cy="6" r="1.5" />
                <circle cx="18" cy="6" r="1.5" />
                <circle cx="6" cy="12" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="18" cy="12" r="1.5" />
                <circle cx="6" cy="18" r="1.5" />
                <circle cx="12" cy="18" r="1.5" />
                <circle cx="18" cy="18" r="1.5" />
              </svg>
            </button>
          </Popover>
        </div>

        {/* Tabs */}
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex space-x-8 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`border-b-2 px-1 py-2 text-sm font-medium ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-500"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        {activeTab === "Tentang" && <About />}
        {activeTab === "Portfolio" && <div>Portfolio Content</div>}
        {activeTab === "Kontak" && <div>Contact Content</div>}
      </main>
    </div>
  );
};

export default SearchPage;

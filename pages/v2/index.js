import Head from "next/head";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import gsap from "gsap";
import { Star } from "lucide-react";
import Navbar from "../../components/v2/Navbar";
import SearchSection from "../../components/v2/SearchSection";
import PortfolioShowcase from "../../components/v2/PortfolioShowcase";
import Footer from "../../components/v2/Footer";
import { Button } from "../../components/v2/Button";

const V2Index = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("I'm a Frontend Developer");
  const [portfolioLimit, setPortfolioLimit] = useState(8);
  const [activeTab, setActiveTab] = useState("Semua");
  const starContainerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const container = starContainerRef.current;
      if (!container) return;

      const starEl = document.createElement('div');
      starEl.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-code"><polyline points="16,18 22,12 16,6"></polyline><polyline points="8,6 2,12 8,18"></polyline></svg>';
      starEl.style.position = 'fixed';
      starEl.style.left = (e.clientX - 12) + 'px';
      starEl.style.top = (e.clientY - 12) + 'px';
      starEl.style.pointerEvents = 'none';
      starEl.style.fontSize = '20px';
      starEl.style.color = '#3b82f6'; // blue color
      starEl.style.zIndex = '50';
      container.appendChild(starEl);

      gsap.fromTo(starEl, 
        { opacity: 1, scale: 0.5, rotation: 0 }, 
        { 
          opacity: 0, 
          scale: 1.5, 
          rotation: 360, 
          y: -100, 
          duration: 1.5, 
          ease: "power2.out",
          onComplete: () => starEl.remove() 
        }
      );
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

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

      <div ref={starContainerRef} className="fixed inset-0 pointer-events-none z-50"></div>

      <Navbar router={router} />

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex space-x-8 border-b border-gray-200">
          <Link href="/about" className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'Semua' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            Semua
          </Link>
          <Link href="/portfolio" className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'Portfolio' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            Portfolio
          </Link>
          <div className="relative">
            <button
              onClick={() => setActiveTab(activeTab === 'Tools' ? 'Semua' : 'Tools')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-1 ${activeTab === 'Tools' || activeTab === 'Typing Test' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                            <span>{activeTab === 'TikTok Downloader' ? activeTab : 'Tools'}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {activeTab === 'Tools' && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[200px]">
                <Link
                  href="/tools"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => setActiveTab('Tools')}
                >
                  Tools
                </Link>
                <Link
                  href="/tools/tiktok-downloader"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => setActiveTab('TikTok Downloader')}
                >
                  TikTok Downloader
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {activeTab === 'Semua' && (
        <>
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
        </>
      )}

      {activeTab === 'Portfolio' && (
        <PortfolioShowcase
          portfolioLimit={portfolioLimit}
          setPortfolioLimit={setPortfolioLimit}
        />
      )}

      {activeTab === 'Tools' && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-4 gap-4">
            {/* Tools grid from tools.js */}
            {[
              { title: "Typing Test", description: "Uji kecepatan mengetik kamu", icon: '⌨️', link: "/tools/typing-test" },
              { title: "Coming Soon", description: "Tool in development", icon: '⚡', link: "#" },
              // ... other tools
            ].map((tool, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
                <div className="p-4 flex items-center space-x-4">
                  <div className="flex-shrink-0 text-2xl">{tool.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">{tool.title}</h3>
                    <p className="text-gray-600 text-xs mb-2">{tool.description}</p>
                    <a href={tool.link} className={`inline-flex items-center space-x-2 px-2 py-1 rounded-full text-white text-xs font-medium ${tool.link === "#" ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"} transition-colors`}>
                      <span>{tool.link === "#" ? "Coming Soon" : "Try Now"}</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Typing Test' && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-4">Typing Test</h2>
          <p>Coming soon...</p>
        </div>
      )}

      {activeTab === 'TikTok Downloader' && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-4">TikTok Downloader</h2>
          <p>Coming soon...</p>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default V2Index;
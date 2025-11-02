import gsap from "gsap";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Footer from "../../components/v2/Footer";
import Navbar from "../../components/v2/Navbar";
import PortfolioShowcase from "../../components/v2/PortfolioShowcase";
import SearchSection from "../../components/v2/SearchSection";

const V2Index = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("I'm a Frontend Developer");
  const [portfolioLimit, setPortfolioLimit] = useState(8);
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
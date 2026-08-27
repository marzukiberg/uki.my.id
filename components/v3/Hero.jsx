import { useEffect, useRef } from "react";
import Link from "next/link";

const BrandLogo = ({ size = "large" }) => {
  const sizeClasses = size === "large" 
    ? "text-5xl sm:text-6xl md:text-7xl tracking-tight" 
    : "text-xl md:text-2xl tracking-tight";
  
  return (
    <h1 className={`font-bold ${sizeClasses}`}>
      <span className="text-red-500">U</span>
      <span className="text-red-500">k</span>
      <span className="text-yellow-500">a</span>
      <span className="text-blue-500">y</span>
      <span className="text-zinc-400">.</span>
      <span className="text-green-500">d</span>
      <span className="text-red-500">e</span>
      <span className="text-blue-500">v</span>
    </h1>
  );
};

const Hero = () => {
  const gridRef = useRef(null);
  
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    
    const handleMouseMove = (e) => {
      const rect = grid.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
      grid.style.backgroundPosition = `${50 + x}% ${50 + y}%`;
    };
    
    grid.addEventListener("mousemove", handleMouseMove);
    return () => grid.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-6 overflow-hidden">
      {/* Subtle grid background */}
      <div 
        ref={gridRef}
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(#0a0a0a 1px, transparent 1px),
            linear-gradient(90deg, #0a0a0a 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          transition: 'background-position 0.15s ease-out'
        }}
      />
      
      {/* Hairline border bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl h-px bg-zinc-200" />
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto py-24">
        {/* Brand mark - the hero moment */}
        <div className="mb-6">
          <BrandLogo size="large" />
        </div>
        
        {/* Role */}
        <p className="font-mono text-xs text-zinc-500 tracking-[0.2em] uppercase mb-8">
          Frontend Engineer &mdash; Fullstack Developer
        </p>
        
        {/* Quick bio */}
        <p className="text-base md:text-lg text-zinc-600 max-w-lg mx-auto mb-12 leading-relaxed">
          Building performant web applications with React, Next.js, and TypeScript. 
          <span className="text-zinc-400"> Based in Indonesia.</span>
        </p>
        
        {/* CTAs */}
        <div className="flex items-center justify-center gap-4">
          <Link 
            href="/v3/about"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors"
          >
            View Work
          </Link>
          <a 
            href="/Marzuki_Front-End_Developer_Resume_ATS.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-200 text-zinc-700 text-sm font-medium rounded-lg hover:bg-zinc-50 transition-colors"
          >
            Resume
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
export { BrandLogo };

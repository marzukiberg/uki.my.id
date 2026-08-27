import Link from "next/link";
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";
import { BrandLogo } from "./Hero";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
      <nav className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/v3" className="hover:opacity-70 transition-opacity">
          <BrandLogo size="small" />
        </Link>
        
        {/* Nav links */}
        <div className="flex items-center gap-6">
          <Link 
            href="/v3/about" 
            className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            About
          </Link>
          <Link 
            href="/about#portfolio" 
            className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            Projects
          </Link>
          
          {/* Social links */}
          <div className="hidden sm:flex items-center gap-3 ml-4 pl-4 border-l border-zinc-200">
            <a
              href="https://github.com/marzukiberg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-900 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/marzukiberg/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-900 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="mailto:marzuki.berg@gmail.com"
              className="text-zinc-500 hover:text-zinc-900 transition-colors"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
          
          {/* Resume CTA */}
          <a
            href="/Marzuki_Front-End_Developer_Resume_ATS.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            Resume
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

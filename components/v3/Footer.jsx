import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer id="footer" className="border-t border-zinc-100 bg-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
          {/* Left: identity + availability */}
          <div>
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-zinc-400 mb-1">
              Marzuki &mdash; Indonesia
            </p>
            <p className="text-sm text-zinc-600 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Available for remote &amp; full-time work
            </p>
          </div>

          {/* Right: links */}
          <div className="flex items-center gap-5">
            <a
              href="https://github.com/marzukiberg"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/marzukiberg/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="/Marzuki_Front-End_Developer_Resume_ATS.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-zinc-500 uppercase tracking-wider hover:text-zinc-900 transition-colors"
            >
              Resume.pdf
            </a>
            <Link
              href="/v3/about"
              className="font-mono text-xs text-zinc-500 uppercase tracking-wider hover:text-zinc-900 transition-colors"
            >
              About
            </Link>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-10 pt-6 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-xs text-zinc-400 font-mono">
            &copy; {year} Ukay.dev
          </p>
          <p className="text-xs text-zinc-300 font-mono">
            Built with React, Next.js, Tailwind
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

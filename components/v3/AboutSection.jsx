import Image from "next/image";
import { Github, Linkedin, Download } from "lucide-react";

/* Compact, hero-adjacent About — profile + one-line role + socials. */
const AboutSection = () => {
  return (
    <section className="border-y border-zinc-100 bg-white">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          {/* Profile + role */}
          <div className="flex items-center gap-4">
            <Image
              src="/img/profile.jpeg"
              alt="Marzuki"
              width={56}
              height={56}
              className="w-14 h-14 rounded-full object-cover border border-zinc-200 grayscale hover:grayscale-0 transition-all duration-300"
            />
            <div>
              <p className="text-base font-bold text-zinc-900 leading-tight">Marzuki</p>
              <p className="font-mono text-xs tracking-widest uppercase text-zinc-500 mt-0.5">
                Frontend Engineer &mdash; Indonesia
              </p>
            </div>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-2 sm:pl-6 sm:border-l sm:border-zinc-200">
            <a
              href="https://github.com/marzukiberg"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:border-zinc-400 transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/marzukiberg/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:border-zinc-400 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="/Marzuki_Front-End_Developer_Resume_ATS.pdf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download resume"
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full border border-zinc-200 font-mono text-xs tracking-widest uppercase text-zinc-500 hover:text-zinc-900 hover:border-zinc-400 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Resume
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

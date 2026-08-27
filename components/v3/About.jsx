import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Briefcase,
  Github,
  Linkedin,
  ExternalLink,
  Download,
  ArrowRight,
} from "lucide-react";
import { BrandLogo } from "./Hero";
import { workExperience } from "../../data/works";

const STACK = ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Laravel"];

/* Swiss micro-label — indexed, hairline-ruled section header */
const SectionLabel = ({ index, title }) => (
  <div className="flex items-center gap-4 mb-6">
    <p className="font-mono text-xs tracking-[0.2em] uppercase text-zinc-400 whitespace-nowrap">
      {index} &mdash; {title}
    </p>
    <div className="h-px flex-1 bg-zinc-200" />
  </div>
);

const About = () => {
  return (
    <section id="about" className="bg-zinc-50 border-t border-zinc-100">
      <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        {/* Section header */}
        <div className="mb-14 md:mb-20">
          <BrandLogo size="small" />
        </div>

        {/* Two-column grid: profile+contact | bio+experience */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* LEFT — Profile + Contact */}
          <aside className="lg:col-span-4 space-y-10">
            {/* Profile */}
            <div>
              <SectionLabel index="01" title="Profile" />
              <div className="flex items-center gap-5">
                <Image
                  src="/img/profile.jpeg"
                  alt="Marzuki"
                  width={80}
                  height={80}
                  priority
                  className="w-20 h-20 rounded-full object-cover border border-zinc-200 grayscale hover:grayscale-0 transition-all duration-300"
                />
                <div>
                  <h2 className="text-xl font-bold text-zinc-900 leading-tight">Marzuki</h2>
                  <p className="font-mono text-xs tracking-widest uppercase text-zinc-500 mt-1">
                    Frontend Engineer &mdash; Fullstack Developer
                  </p>
                </div>
              </div>
              <p className="mt-4 flex items-center gap-1.5 font-mono text-xs text-zinc-500">
                <MapPin className="w-3.5 h-3.5" />
                Pekanbaru, Indonesia
              </p>
            </div>

            {/* Bio */}
            <div>
              <SectionLabel index="02" title="Bio" />
              <p className="text-sm md:text-base text-zinc-600 leading-relaxed">
                Frontend and fullstack developer building performant, precise web applications.
                Currently shipping clinic management software at Assist.id; previously delivering
                fullstack products for government systems, startups, and independent clients across
                Indonesia.
                <span className="text-zinc-400">
                  {" "}Obsessed with clean state architecture, responsive performance, and the small details.
                </span>
              </p>
            </div>

            {/* Contact / Socials */}
            <div>
              <SectionLabel index="03" title="Contact" />
              <ul className="divide-y divide-zinc-200 border-t border-b border-zinc-200">
                <li>
                  <a
                    href="https://github.com/marzukiberg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between py-3 text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <Github className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                      github.com/marzukiberg
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-300 group-hover:text-zinc-600 transition-colors" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/marzukiberg/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between py-3 text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <Linkedin className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                      linkedin.com/in/marzukiberg
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-300 group-hover:text-zinc-600 transition-colors" />
                  </a>
                </li>
                <li>
                  <a
                    href="/Marzuki_Front-End_Developer_Resume_ATS.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between py-3 text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <Download className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                      Resume.pdf
                    </span>
                    <span className="font-mono text-[10px] tracking-widest uppercase text-zinc-400 group-hover:text-zinc-600 transition-colors">
                      PDF
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </aside>

          {/* RIGHT — Experience + Stack + CTA */}
          <div className="lg:col-span-8">
            {/* Work experience */}
            <div>
              <SectionLabel index="04" title="Experience" />
              <ul>
                {workExperience.map((work) => (
                  <li
                    key={work.id}
                    className="group py-6 first:pt-0 last:pb-0 border-b border-zinc-200 last:border-b-0"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-6">
                      <a
                        href={work.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-base font-bold text-zinc-900 hover:text-zinc-600 transition-colors"
                      >
                        {work.company}
                        <ExternalLink className="w-3.5 h-3.5 text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                      </a>
                      <p className="font-mono text-xs text-zinc-400 tracking-wider whitespace-nowrap">
                        {work.period}
                      </p>
                    </div>
                    <p className="mt-0.5 flex items-center gap-2 text-sm text-zinc-500">
                      <Briefcase className="w-3.5 h-3.5" />
                      {work.position}
                    </p>
                    <p className="mt-3 text-sm text-zinc-600 leading-relaxed max-w-prose">
                      {work.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech stack */}
            <div className="mt-14">
              <SectionLabel index="05" title="Stack" />
              <div className="flex flex-wrap gap-2">
                {STACK.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-xs px-3 py-1.5 rounded-full border border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 transition-colors cursor-default"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-14 pt-8 border-t border-zinc-200 flex items-center justify-between gap-6">
              <p className="font-mono text-xs tracking-[0.2em] uppercase text-zinc-400 hidden sm:block">
                Selected projects below
              </p>
              <Link
                href="/v3/#projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors"
              >
                View Work
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

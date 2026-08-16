import React from "react";
import Image from "next/image";
import { MapPin, Briefcase, GraduationCap, Globe, Mail, Github, Linkedin, ExternalLink } from "lucide-react";

const About = ({ hideResultCount = false }) => {
  return (
    <section id="about" className="py-2">
      {/* Search Result Stats */}
      {!hideResultCount && (
        <div className="mb-6 text-xs text-[#70757a]">
          About 1 result (0.24 seconds)
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Organic Google Search Result (Main Bio) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Search Result Item */}
          <div className="space-y-1">
            {/* Google Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-[#202124]">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f1f3f4] text-xs font-medium text-blue-600">
                U
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[#202124] font-normal">Ukay.dev</span>
                <span className="text-[11px] text-[#4d5156] truncate">https://ukay.dev &rsaquo; about &rsaquo; marzuki</span>
              </div>
            </div>

            {/* Google Search Result Title */}
            <h1 className="pt-1 text-xl font-normal text-[#1a0dab] hover:underline cursor-pointer">
              Marzuki &mdash; Frontend Developer &amp; Fullstack Engineer
            </h1>

            {/* Google Snippet Text */}
            <p className="pt-1 text-sm leading-relaxed text-[#4d5156]">
              Professional software engineer with 4+ years of experience specializing in web development. Experienced in building high-performance web applications using modern technologies including <strong>React.js</strong>, <strong>Next.js</strong>, <strong>TypeScript</strong>, <strong>Tailwind CSS</strong>, <strong>Node.js</strong>, and <strong>Laravel</strong>.
            </p>
          </div>

          {/* Google Sitelinks / Highlights Box */}
          <div className="rounded-xl border border-[#dadce0] p-4 bg-white space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#70757a]">
              Key Highlights &amp; Skills
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
              <div className="border-l-2 border-blue-500 pl-3 py-0.5">
                <span className="font-semibold text-[#202124] block">Modern Frontend</span>
                <span className="text-[#5f6368]">React, Next.js (App &amp; Pages Router), Tailwind CSS</span>
              </div>
              <div className="border-l-2 border-green-500 pl-3 py-0.5">
                <span className="font-semibold text-[#202124] block">Backend &amp; API</span>
                <span className="text-[#5f6368]">Node.js, Express, RESTful APIs, Supabase, Firebase</span>
              </div>
              <div className="border-l-2 border-yellow-500 pl-3 py-0.5">
                <span className="font-semibold text-[#202124] block">Fullstack Systems</span>
                <span className="text-[#5f6368]">Authentication, PDF Services, AI Integrations</span>
              </div>
              <div className="border-l-2 border-red-500 pl-3 py-0.5">
                <span className="font-semibold text-[#202124] block">Performance &amp; SEO</span>
                <span className="text-[#5f6368]">Core Web Vitals, SSR, Responsive Design</span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="/Marzuki_Front-End_Developer_Resume_ATS.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-blue-600 bg-blue-50 px-4 py-2 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
            >
              Download ATS Resume
            </a>
            <a
              href="https://github.com/marzukiberg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/marzukiberg/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Linkedin className="h-3.5 w-3.5" />
              LinkedIn
            </a>
          </div>
        </div>

        {/* Right Column: Google Knowledge Panel */}
        <div className="lg:col-span-5">
          <div className="overflow-hidden rounded-2xl border border-[#dadce0] bg-white shadow-xs">
            {/* Knowledge Panel Header Image / Banner - Clean Google Solid Background */}
            <div className="relative border-b border-[#dadce0] bg-[#f8f9fa] p-5 text-center">
              <div className="mx-auto mb-2.5 h-16 w-16 overflow-hidden rounded-full border border-gray-200 shadow-xs">
                <Image
                  src="/img/profile.jpeg"
                  alt="Marzuki"
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>
              <h2 className="text-lg font-semibold text-[#202124] leading-tight">Marzuki</h2>
              <p className="text-xs text-[#5f6368] mt-0.5">Frontend Engineer &bull; Fullstack Developer</p>
            </div>

            {/* Knowledge Panel Details */}
            <div className="p-4 space-y-4 text-xs text-[#3c4043]">
              <div className="border-b border-gray-100 pb-3">
                <p className="text-xs leading-relaxed text-[#4d5156]">
                  Software engineer with expertise in developing interactive user interfaces, web applications, and automated tools.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-[#70757a]" />
                  <span className="font-medium text-[#202124]">Experience:</span>
                  <span>4+ Years in Software Engineering</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#70757a]" />
                  <span className="font-medium text-[#202124]">Location:</span>
                  <span>Indonesia (Available Worldwide Remote)</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-[#70757a]" />
                  <span className="font-medium text-[#202124]">Specialization:</span>
                  <span>React, Next.js, Web Performance</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-[#70757a]" />
                  <span className="font-medium text-[#202124]">Website:</span>
                  <a href="https://ukay.dev" className="text-[#1a0dab] hover:underline">
                    ukay.dev
                  </a>
                </div>
              </div>

              {/* Profiles on web */}
              <div className="border-t border-gray-100 pt-3">
                <span className="text-[11px] font-semibold uppercase text-[#70757a] block mb-2">
                  Profiles
                </span>
                <div className="flex gap-2">
                  <a
                    href="https://github.com/marzukiberg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                  >
                    <Github className="h-3.5 w-3.5" />
                    GitHub
                  </a>
                  <a
                    href="https://www.linkedin.com/in/marzukiberg/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                  >
                    <Linkedin className="h-3.5 w-3.5" />
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

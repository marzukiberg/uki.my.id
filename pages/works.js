import Head from "next/head";
import { useState } from "react";
import AppLayout from "../components/AppLayout";
import * as Icons from "lucide-react";

import { workExperience } from "../data/works";

const WorksPage = () => {
  const [activeTab, setActiveTab] = useState("Works");

  return (
    <>
      <Head>
        <title>Ukay.dev | Work Experience &amp; Career</title>
      </Head>
      <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        <div className="py-2 max-w-4xl">
          {/* Search Result Stats / Google Breadcrumb Header */}
          <div className="mb-6">
            <div className="text-xs text-[#70757a] mb-1">
              About 2 career entries &bull; 4+ years total experience (0.19 seconds)
            </div>
            <div className="flex items-center gap-2 text-xs text-[#202124]">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f1f3f4] text-[10px] font-medium text-blue-600">
                W
              </div>
              <span className="text-xs text-[#202124]">Ukay.dev &rsaquo; experience &rsaquo; career-history</span>
            </div>
            <h1 className="mt-1 text-2xl font-normal text-[#202124]">
              Work Experience &amp; Career History
            </h1>
            <p className="mt-1 text-sm text-[#4d5156]">
              A timeline of my 4+ years of professional software engineering experience — roles, tech stacks, and quantifiable impact.
            </p>
          </div>

          {/* Experience List - Google Search Result Style */}
          <div className="space-y-8">
            {workExperience.map((work) => (
              <div
                key={work.id}
                className="rounded-2xl border border-[#dadce0] bg-white p-5 md:p-6 transition-all hover:border-gray-300 hover:shadow-xs"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 border-b border-gray-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-medium text-[#1a0dab] hover:underline">
                        <a
                          href={work.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5"
                        >
                          {work.company}
                          <Icons.ExternalLink className="h-3.5 w-3.5 opacity-70" />
                        </a>
                      </h2>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 text-xs text-[#202124] font-medium mt-0.5">
                      <span className="text-blue-700">{work.position}</span>
                      <span className="text-gray-400">&bull;</span>
                      <span className="text-[#5f6368] flex items-center gap-1">
                        <Icons.MapPin className="h-3 w-3 inline" />
                        {work.location}
                      </span>
                    </div>
                  </div>

                  {/* Period Badge */}
                  <span className="inline-flex items-center self-start rounded-full bg-[#f1f3f4] px-3 py-1 text-xs font-medium text-[#3c4043]">
                    {work.period}
                  </span>
                </div>

                {/* Description */}
                <p className="mt-3 text-sm leading-relaxed text-[#4d5156]">
                  {work.description}
                </p>

                {/* Key Achievements */}
                <div className="mt-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#70757a] mb-2">
                    Key Achievements &amp; Responsibilities:
                  </h3>
                  <ul className="space-y-1.5 text-xs md:text-sm text-[#3c4043]">
                    {work.achievements.map((achievement, achIndex) => (
                      <li key={achIndex} className="flex items-start gap-2">
                        <Icons.CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technologies */}
                <div className="mt-4 flex flex-wrap items-center gap-1.5 pt-3 border-t border-gray-100">
                  <span className="text-xs text-[#70757a] mr-1">Technologies:</span>
                  {work.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="rounded-md border border-gray-100 bg-[#f8f9fa] px-2 py-0.5 text-xs text-[#3c4043]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </AppLayout>
    </>
  );
};

export default WorksPage;
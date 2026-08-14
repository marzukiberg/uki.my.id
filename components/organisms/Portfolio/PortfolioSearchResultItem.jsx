import React from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { getPortfolioImageUrl } from "../../../utils/imageUtils";

const PortfolioSearchResultItem = ({ project }) => {
  const isLive = Boolean(project.link && project.link !== "/#" && project.link.trim() !== "");
  const imageUrl = getPortfolioImageUrl(project);

  return (
    <div className="group">
      {/* Google URL Breadcrumb */}
      <div className="mb-1 flex items-center gap-2 text-xs text-[#202124]">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f1f3f4] text-[10px] font-semibold text-blue-600">
          {project.title ? project.title.charAt(0) : "P"}
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-normal text-[#202124]">
            {project.title}
          </span>
          <span className="max-w-sm truncate text-[11px] text-[#4d5156]">
            {isLive ? project.link : "https://uki.my.id › portfolio › archived"}
          </span>
        </div>

        {/* Status Badge */}
        {isLive ? (
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            Live
          </span>
        ) : (
          <span className="ml-auto rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
            Archived
          </span>
        )}
      </div>

      {/* Title Link */}
      <div className="flex items-baseline gap-2">
        {isLive ? (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-lg font-normal text-[#1a0dab] group-hover:underline"
          >
            <span>{project.title}</span>
            <ExternalLink className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />
          </a>
        ) : (
          <h3 className="text-lg font-normal text-[#202124]">
            {project.title}
          </h3>
        )}
      </div>

      {/* Main Content with Optional Google Thumbnail */}
      <div className="mt-1.5 flex gap-4">
        {imageUrl && (
          <div className="relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50 md:h-24 md:w-40">
            <Image
              src={imageUrl}
              alt={project.title}
              fill
              className={`object-cover ${!isLive ? "grayscale-[30%]" : ""}`}
              unoptimized
            />
          </div>
        )}

        <div className="flex-1">
          <p className="text-sm leading-relaxed text-[#4d5156]">
            {project.description || project.text}
          </p>

          {/* Tech Stack Pills */}
          {project.stacks && project.stacks.length > 0 && (
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-[#70757a]">Stack:</span>
              {project.stacks.map((stack) => (
                <span
                  key={stack}
                  className="inline-flex items-center rounded-md border border-gray-100 bg-[#f8f9fa] px-1.5 py-0.5 text-[11px] text-[#3c4043]"
                >
                  {stack.replace(/\.(png|svg|jpg|jpeg)$/i, "")}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioSearchResultItem;

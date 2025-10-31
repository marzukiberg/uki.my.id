import React, { useRef } from "react";
import { ChevronRight } from 'lucide-react';
import portfolioData from "../../../data/portfolio.json";
import { getPortfolioImageUrl } from "../../../utils/imageUtils";
import Image from "next/image";
import Link from "next/link";
import ProjectCard from "../../v2/ProjectCard";

const PortfolioGrid = () => {
  const scrollRef = useRef(null);
  return (
    <section id="portfolio" className="pb-12 sm:pb-16">
      <div className="max-w-6xl mx-auto relative">
        <div className="flex overflow-x-auto hide-scrollbar space-x-4 mb-8" ref={scrollRef}>
          {portfolioData.projects.filter(p => p.title).map((project, index) => (
            <Link
              key={index}
              href={project.link && project.link !== "/#" ? project.link : ""}
              className={`min-w-[140px] h-11 flex items-center bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow overflow-hidden ${!project.link || project.link === "/#" ? "cursor-default" : ""}`}
              target={project.link && project.link !== "/#" ? "_blank" : undefined}
              rel="noopener noreferrer"
              id={`portfolio-item-${index}`}
            >
              {project.localImage ? (
                <Image src={getPortfolioImageUrl(project)} alt={project.title} width={44} height={44} className="w-11 h-11 object-cover" unoptimized />
              ) : (
                <Image src={getPortfolioImageUrl(project)} alt={project.title} width={44} height={44} className="w-11 h-11 object-cover" unoptimized />
              )}
              <div className="p-2 flex-1">
                <h3 className="text-xs font-medium text-gray-900 whitespace-nowrap">{project.title}</h3>
              </div>
            </Link>
          ))}
        </div>

        {/* right scroll button */}
        <button
          aria-label="Scroll right"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-100 hover:bg-gray-200 p-2 rounded-full shadow-sm"
          onClick={() => {
            if (scrollRef.current) scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
          }}
        >
          <ChevronRight className="h-5 w-5 text-gray-700" />
        </button>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {portfolioData.projects.filter(p => p.title).map((project, index) => (
            <ProjectCard key={index} project={project} showTechStacks={false} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioGrid;
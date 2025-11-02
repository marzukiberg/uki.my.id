import React, { useRef, useState } from "react";
import { ChevronRight, ImageOff } from 'lucide-react';
import portfolioData from "../../../data/portfolio.json";
import { getPortfolioImageUrl } from "../../../utils/imageUtils";
import Image from "next/image";
import Link from "next/link";
import ProjectCard from "../../v2/ProjectCard";

const PortfolioGrid = () => {
  const scrollRef = useRef(null);
  const [failedImages, setFailedImages] = useState(new Set());

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const handleImageError = (projectIndex) => {
    setFailedImages(prev => new Set([...prev, projectIndex]));
  };

  return (
    <section id="portfolio" className="pb-12 sm:pb-16">
      <div className="max-w-6xl mx-auto relative">
        <div className="relative">
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
                {failedImages.has(index) ? (
                  <div className="w-11 h-11 bg-gray-100 flex items-center justify-center rounded">
                    <ImageOff className="w-6 h-6 text-gray-400" />
                  </div>
                ) : project.localImage ? (
                  <Image
                    src={getPortfolioImageUrl(project)}
                    alt={project.title}
                    width={44}
                    height={44}
                    className="w-11 h-11 object-cover"
                    unoptimized
                    onError={() => handleImageError(index)}
                  />
                ) : (
                  <Image
                    src={getPortfolioImageUrl(project)}
                    alt={project.title}
                    width={44}
                    height={44}
                    className="w-11 h-11 object-cover"
                    unoptimized
                    onError={() => handleImageError(index)}
                  />
                )}
                <div className="p-2 flex-1">
                  <h3 className="text-xs font-medium text-gray-900 whitespace-nowrap">{project.title}</h3>
                </div>
              </Link>
            ))}
          </div>

          {/* right scroll button - fixed position within thumbnail area */}
          <button
            aria-label="Scroll right"
            className="absolute right-0 top-0 bottom-0 my-auto w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full shadow-sm z-10 flex items-center justify-center"
            onClick={handleScrollRight}
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        </div>

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
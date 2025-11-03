import React, { useRef, useState } from "react";
import { ChevronRight, ImageOff } from "lucide-react";
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
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const handleImageError = (projectIndex) => {
    setFailedImages((prev) => new Set([...prev, projectIndex]));
  };

  return (
    <section id="portfolio" className="pb-12 sm:pb-16">
      <div className="relative mx-auto max-w-6xl">
        <div className="relative">
          <div
            className="hide-scrollbar mb-8 flex space-x-4 overflow-x-auto"
            ref={scrollRef}
          >
            {portfolioData.projects
              .filter((p) => p.title)
              .map((project, index) => (
                <Link
                  key={index}
                  href={
                    project.link && project.link !== "/#" ? project.link : ""
                  }
                  className={`flex h-11 min-w-[140px] items-center overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md ${
                    !project.link || project.link === "/#"
                      ? "cursor-default"
                      : ""
                  }`}
                  target={
                    project.link && project.link !== "/#" ? "_blank" : undefined
                  }
                  rel="noopener noreferrer"
                  id={`portfolio-item-${index}`}
                >
                  {failedImages.has(index) ? (
                    <div className="flex h-11 w-11 items-center justify-center rounded bg-gray-100">
                      <ImageOff className="h-6 w-6 text-gray-400" />
                    </div>
                  ) : project.localImage ? (
                    <Image
                      src={getPortfolioImageUrl(project)}
                      alt={project.title}
                      width={44}
                      height={44}
                      className="h-11 w-11 object-cover"
                      unoptimized
                      onError={() => handleImageError(index)}
                    />
                  ) : (
                    <Image
                      src={getPortfolioImageUrl(project)}
                      alt={project.title}
                      width={44}
                      height={44}
                      className="h-11 w-11 object-cover"
                      unoptimized
                      onError={() => handleImageError(index)}
                    />
                  )}
                  <div className="flex-1 p-2">
                    <h3 className="whitespace-nowrap text-xs font-medium text-gray-900">
                      {project.title}
                    </h3>
                  </div>
                </Link>
              ))}
          </div>

          {/* right scroll button - fixed position within thumbnail area */}
          <button
            aria-label="Scroll right"
            className="absolute bottom-0 right-0 top-0 z-10 my-auto flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 shadow-sm hover:bg-gray-200"
            onClick={handleScrollRight}
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {portfolioData.projects
            .filter((p) => p.title)
            .map((project, index) => (
              <ProjectCard
                key={index}
                project={project}
                showTechStacks={false}
                index={index}
              />
            ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioGrid;

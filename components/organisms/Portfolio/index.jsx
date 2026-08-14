import React from "react";
import portfolioData from "../../../data/portfolio.json";
import PortfolioSearchResultItem from "./PortfolioSearchResultItem";

const Portfolio = ({ projects = null, hideHeader = false }) => {
  const allProjects = projects || portfolioData.projects.filter((p) => p.title);
  const validProjects = allProjects.filter((p) => p.title);
  const activeProjects = validProjects.filter(
    (p) => p.link && p.link !== "/#" && p.link.trim() !== ""
  );

  return (
    <section id="portfolio" className="pt-8 pb-16">
      {/* Google Result Section Title */}
      {!hideHeader && (
        <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-3">
          <div>
            <h2 className="text-xl font-normal text-[#202124]">
              Portfolio &amp; Selected Works
            </h2>
            <p className="mt-0.5 text-xs text-[#70757a]">
              Showing {validProjects.length} results ({activeProjects.length} active live projects)
            </p>
          </div>
        </div>
      )}

      {/* Google Organic Search Results List */}
      <div className="max-w-3xl space-y-8">
        {validProjects.map((project, index) => (
          <PortfolioSearchResultItem
            key={project.id || `${project.title}-${index}`}
            project={project}
          />
        ))}
      </div>
    </section>
  );
};

export default Portfolio;

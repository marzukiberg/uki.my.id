import React from "react";
import portfolioData from "../../../data/portfolio.json";
import Image from "next/image";
import { getPortfolioImageUrl } from "../../../utils/imageUtils";

const Portfolio = () => {
  return (
    <section id="portfolio" className="pb-12 sm:pb-16">
      <div className="max-w-4xl">
        <p className="text-sm text-gray-600 mb-4">About {portfolioData.projects.filter(p => p.title).length} results</p>
        {portfolioData.projects.filter(p => p.title).map((project, index) => (
          <div key={index} className="flex gap-4 mb-8">
            <div className="flex-shrink-0 w-24 h-16 md:w-48 md:h-36 relative">
              <Image src={getPortfolioImageUrl(project)} alt={project.title} fill className="rounded object-cover" />
            </div>
            <div className="flex-1">
              <a href={project.link} target="_blank" rel="noopener noreferrer">
                <p className="text-sm text-gray-600">{project.link}</p>
                <h2 className="text-xl text-blue-800 font-medium hover:underline">{project.title}</h2>
              </a>
              <p className="text-gray-600">{project.text}</p>
              <p className="text-gray-500 text-sm">Tech Stack: {project.stacks.map(stack => stack.replace(/\.(png|svg|jpg|jpeg)$/i, '')).join(', ')}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Portfolio;
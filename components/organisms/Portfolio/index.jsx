import React from "react";
import portfolioData from "../../../data/portfolio.json";
import Image from "next/image";
import { getPortfolioImageUrl } from "../../../utils/imageUtils";

const Portfolio = () => {
  return (
    <section id="portfolio" className="pb-12 sm:pb-16">
      <div className="max-w-4xl">
        <p className="mb-4 text-sm text-gray-600">
          About {portfolioData.projects.filter((p) => p.title).length} results
        </p>
        {portfolioData.projects
          .filter((p) => p.title)
          .map((project, index) => (
            <div key={index} className="mb-8 flex gap-4">
              <div className="relative h-16 w-24 flex-shrink-0 md:h-36 md:w-48">
                <Image
                  src={getPortfolioImageUrl(project)}
                  alt={project.title}
                  fill
                  className="rounded object-cover"
                />
              </div>
              <div className="flex-1">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <p className="text-sm text-gray-600">{project.link}</p>
                  <h2 className="text-xl font-medium text-blue-800 hover:underline">
                    {project.title}
                  </h2>
                </a>
                <p className="text-gray-600">{project.text}</p>
                <p className="text-sm text-gray-500">
                  Tech Stack:{" "}
                  {project.stacks
                    .map((stack) => stack.replace(/\.(png|svg|jpg|jpeg)$/i, ""))
                    .join(", ")}
                </p>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
};

export default Portfolio;

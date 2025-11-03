import Image from "next/image";
import Link from "next/link";
import portfolioData from "../../data/portfolio.json";
import { getPortfolioImageUrl } from "../../utils/imageUtils";
import ProjectCard from "./ProjectCard";

const PortfolioShowcase = ({ portfolioLimit, setPortfolioLimit }) => {
  return (
    <div id="showcases" className="mx-auto mt-8 w-full max-w-6xl px-4 md:mt-12">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-2xl font-bold text-gray-800 md:text-3xl">
          Featured Projects
        </h2>
        <p className="text-sm text-gray-600 md:text-base">
          Explore some of my recent work and creative endeavors
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {portfolioData.projects
          .filter((p) => p.title)
          .slice(0, portfolioLimit)
          .map((project, index) => (
            <ProjectCard
              key={index}
              project={project}
              showTechStacks={true}
              index={index}
            />
          ))}
      </div>
      {portfolioLimit <
        portfolioData.projects.filter((p) => p.title).length && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setPortfolioLimit((prev) => prev + 8)}
            className="rounded-full bg-blue-600 px-8 py-3 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default PortfolioShowcase;

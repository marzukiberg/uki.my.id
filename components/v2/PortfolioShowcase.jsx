import Image from "next/image";
import Link from "next/link";
import portfolioData from "../../data/portfolio.json";
import { getPortfolioImageUrl } from "../../utils/imageUtils";
import ProjectCard from "./ProjectCard";

const PortfolioShowcase = ({ portfolioLimit, setPortfolioLimit }) => {
    return (
        <div id="showcases" className="w-full max-w-6xl px-4 mx-auto mt-8 md:mt-12">
            <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Featured Projects</h2>
                <p className="text-gray-600 text-sm md:text-base">Explore some of my recent work and creative endeavors</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {portfolioData.projects.filter(p => p.title).slice(0, portfolioLimit).map((project, index) => (
                    <ProjectCard key={index} project={project} showTechStacks={true} index={index} />
                ))}
            </div>
            {portfolioLimit < portfolioData.projects.filter(p => p.title).length && (
                <div className="text-center mt-8">
                    <button
                        onClick={() => setPortfolioLimit(prev => prev + 8)}
                        className="rounded-full bg-blue-600 px-8 py-3 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
};

export default PortfolioShowcase;
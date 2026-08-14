import { useState } from "react";
import portfolioData from "../../data/portfolio.json";
import ProjectCard from "./ProjectCard";
import { Sparkles, Archive, Layers } from "lucide-react";

const PortfolioShowcase = () => {
  const [activeTab, setActiveTab] = useState("all"); // "all" | "active" | "inactive"

  const validProjects = portfolioData.projects.filter((p) => p.title);
  
  // Categorize projects based on link existence
  const activeProjects = validProjects.filter(
    (p) => p.link && p.link !== "/#" && p.link.trim() !== ""
  );
  const inactiveProjects = validProjects.filter(
    (p) => !p.link || p.link === "/#" || p.link.trim() === ""
  );

  return (
    <div id="showcases" className="mx-auto mt-12 w-full max-w-6xl px-4 md:mt-16">
      {/* Google-style Hero Section */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-4 py-1.5 text-xs font-medium text-blue-700 mb-4 shadow-xs">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Showcase & Work Portfolio</span>
        </div>
        
        {/* Hero Headline - Google Style */}
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          Featured Projects
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-gray-500 md:text-base">
          Explore production-ready apps, web applications, and experimental creations
        </p>
        
        {/* Stats Row - Google inspired */}
        <div className="mt-6 flex items-center justify-center gap-8 md:gap-12">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 md:text-3xl">{validProjects.length}</div>
            <div className="text-xs text-gray-500 md:text-sm">Projects</div>
          </div>
          <div className="h-8 w-px bg-gray-200"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600 md:text-3xl">{activeProjects.length}</div>
            <div className="text-xs text-gray-500 md:text-sm">Active</div>
          </div>
          <div className="h-8 w-px bg-gray-200"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-400 md:text-3xl">{inactiveProjects.length}</div>
            <div className="text-xs text-gray-500 md:text-sm">Archived</div>
          </div>
        </div>

        {/* Google-style Pill Filter Tabs */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setActiveTab("all")}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-150 ${
              activeTab === "all"
                ? "bg-gray-900 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            All
          </button>
          <button
            onClick={() => setActiveTab("active")}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-150 ${
              activeTab === "active"
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            Active
          </button>
          <button
            onClick={() => setActiveTab("inactive")}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-150 ${
              activeTab === "inactive"
                ? "bg-gray-700 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
            }`}
          >
            <Archive className="h-3.5 w-3.5" />
            Archived
          </button>
        </div>
      </div>

      {/* Grid Container */}
      <div className="space-y-12">
        {/* Active Projects Section */}
        {(activeTab === "all" || activeTab === "active") && (
          <div>
            {activeTab === "all" && (
              <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                <h3 className="text-sm font-semibold tracking-wide text-gray-900 uppercase">
                  Active Projects
                </h3>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  {activeProjects.length} live
                </span>
              </div>
            )}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {activeProjects.map((project, index) => (
                <ProjectCard
                  key={`active-${project.title}-${index}`}
                  project={project}
                  showTechStacks={true}
                  index={index}
                  isInactive={false}
                />
              ))}
            </div>
          </div>
        )}

        {/* Inactive Projects Section */}
        {(activeTab === "all" || activeTab === "inactive") && (
          <div>
            {activeTab === "all" && (
              <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                <Archive className="h-4 w-4 text-gray-400" />
                <h3 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">
                  Inactive &amp; Archived
                </h3>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                  {inactiveProjects.length} archived
                </span>
              </div>
            )}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {inactiveProjects.map((project, index) => (
                <ProjectCard
                  key={`inactive-${project.title}-${index}`}
                  project={project}
                  showTechStacks={true}
                  index={index}
                  isInactive={true}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioShowcase;

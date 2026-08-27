import { useState } from "react";
import portfolioData from "../../data/portfolio.json";
import ProjectCard from "./ProjectCard";
import { Layers, Archive, Zap } from "lucide-react";

const ProjectGrid = () => {
  const [activeTab, setActiveTab] = useState("all");

  const projects = portfolioData.projects.filter((p) => p.title);
  const activeProjects = projects.filter(
    (p) => p.link && p.link !== "/#" && p.link.trim() !== ""
  );
  const inactiveProjects = projects.filter(
    (p) => !p.link || p.link === "/#" || p.link.trim() === ""
  );

  const filteredProjects =
    activeTab === "all"
      ? projects
      : activeTab === "active"
        ? activeProjects
        : inactiveProjects;

  const tabs = [
    { id: "all", label: "All", count: projects.length, Icon: Layers },
    { id: "active", label: "Active", count: activeProjects.length, Icon: Zap },
    { id: "inactive", label: "Archived", count: inactiveProjects.length, Icon: Archive },
  ];

  return (
    <section id="projects" className="py-20 px-6 bg-zinc-50/50 border-t border-zinc-100">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
              Selected Work
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              Production applications and experiments
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm font-mono">
            <div>
              <span className="text-emerald-600 font-semibold">{activeProjects.length}</span>
              <span className="text-zinc-400 ml-2 uppercase text-xs tracking-wider">live</span>
            </div>
            <div className="h-4 w-px bg-zinc-200" />
            <div>
              <span className="text-zinc-500 font-semibold">{inactiveProjects.length}</span>
              <span className="text-zinc-400 ml-2 uppercase text-xs tracking-wider">archived</span>
            </div>
          </div>
        </div>

        {/* Filter tabs — Swiss underline style */}
        <div className="flex items-center gap-1 mb-8 border-b border-zinc-200 overflow-x-auto">
          {tabs.map(({ id, label, count, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
                activeTab === id
                  ? "border-zinc-900 text-zinc-900"
                  : "border-transparent text-zinc-500 hover:text-zinc-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              <span className="text-xs text-zinc-400 font-mono">({count})</span>
            </button>
          ))}
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={`${activeTab}-${project.title}-${index}`}
              project={project}
              index={index}
              isInactive={activeTab === "all" && !activeProjects.includes(project)}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <p className="text-sm text-zinc-400 text-center py-12 font-mono">
            No projects in this category.
          </p>
        )}
      </div>
    </section>
  );
};

export default ProjectGrid;

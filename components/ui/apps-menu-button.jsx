import * as Icons from "lucide-react";
import React from "react";
import portfolioData from "../../data/portfolio.json";
import Popover from "./popover";
import Link from "next/link";

const AppsMenuButton = ({ className = "" }) => {
    return (
        <Popover
            className={className}
            content={(setTooltip) => (
                <div className="grid grid-cols-3 gap-2 bg-white p-4 rounded-2xl shadow-lg">
                    {portfolioData.projects.filter(p => p.title).map((project, index) => (
                        <Link key={index} href={project.link && project.link !== "/#" ? project.link : ""} legacyBehavior>
                            <a
                                target={project.link && project.link !== "/#" ? "_blank" : undefined}
                                rel="noopener noreferrer"
                                className={`block p-2 text-center text-xs text-gray-800 hover:bg-gray-100 rounded-lg transition-colors max-w-24 ${!project.link || project.link === "/#" ? "cursor-default pointer-events-none" : ""}`}
                                onMouseEnter={(e) => setTooltip({ img: project.img, title: project.title, x: e.clientX + 10, y: e.clientY + 10 })}
                                onMouseLeave={() => setTooltip(null)}
                            >
                                <div className="w-12 h-12 mx-auto mb-1 rounded-full flex items-center justify-center bg-gray-100">
                                    {React.createElement(Icons[project.icon] || Icons.Circle, { size: 24, className: "text-gray-700" })}
                                </div>
                                <div className="text-xs leading-tight break-words truncate">{project.title}</div>
                            </a>
                        </Link>
                    ))}
                </div>
            )}
        >
            <button className="p-1 rounded-full hover:bg-gray-200 border border-transparent focus:outline-none focus:ring-2 focus:ring-gray-400">
                <svg className="w-5 h-5 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="6" cy="6" r="1.5" />
                    <circle cx="12" cy="6" r="1.5" />
                    <circle cx="18" cy="6" r="1.5" />
                    <circle cx="6" cy="12" r="1.5" />
                    <circle cx="12" cy="12" r="1.5" />
                    <circle cx="18" cy="12" r="1.5" />
                    <circle cx="6" cy="18" r="1.5" />
                    <circle cx="12" cy="18" r="1.5" />
                    <circle cx="18" cy="18" r="1.5" />
                </svg>
            </button>
        </Popover>
    );
};

export default AppsMenuButton;
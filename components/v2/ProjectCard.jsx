import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ImageOff } from "lucide-react";
import { getPortfolioImageUrl } from "../../utils/imageUtils";

const ProjectCard = ({ project, showTechStacks = false, index, isInactive = false }) => {
  const [imageError, setImageError] = useState(false);
  const isClickable = Boolean(project.link && project.link !== "/#" && !isInactive);

  const cardContent = (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white transition-all duration-300 ${
        isClickable
          ? "hover:-translate-y-1 hover:shadow-xl cursor-pointer"
          : "opacity-70 bg-gray-50/50 cursor-default"
      }`}
      id={`portfolio-item-${index}`}
      style={{
        boxShadow: isClickable ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
      }}
    >
      {/* Image area - Google style: full width, rounded top */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
        {imageError || !getPortfolioImageUrl(project) ? (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
            <ImageOff className="h-10 w-10 stroke-[1.5]" />
          </div>
        ) : (
          <Image
            src={getPortfolioImageUrl(project)}
            alt={project.title}
            fill
            className={`object-cover transition-transform duration-500 ${
              isClickable ? "group-hover:scale-105" : "grayscale-[30%]"
            }`}
            unoptimized
            onError={() => setImageError(true)}
          />
        )}

        {/* Status Badge - Google style: minimal, top right */}
        {isInactive ? (
          <div className="absolute right-2.5 top-2.5 rounded-full bg-gray-900/80 px-2.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
            Archived
          </div>
        ) : (
          <div className="absolute right-2.5 top-2.5 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-medium text-emerald-600 backdrop-blur-sm shadow-sm flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Active
          </div>
        )}
      </div>

      {/* Content area - Google style: minimal padding, clean typography */}
      <div className="flex flex-1 flex-col p-4">
        <h3
          className={`text-sm font-medium leading-snug md:text-[15px] ${
            isClickable
              ? "text-gray-900 group-hover:text-blue-600 transition-colors"
              : "text-gray-600"
          }`}
        >
          {project.title}
        </h3>

        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-gray-500">
          {project.text}
        </p>

        {/* Tech Stacks - Google style: subtle, small */}
        <div className="mt-auto pt-3">
          {showTechStacks && project.stacks && project.stacks.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {project.stacks.slice(0, 4).map((stack) => (
                <div
                  key={stack}
                  className="inline-flex items-center rounded bg-gray-50 px-1.5 py-0.5"
                  title={stack.replace(/\.(png|svg|jpg|jpeg)$/i, "")}
                >
                  <Image
                    src={`/img/logos/${stack}`}
                    alt={stack}
                    width={14}
                    height={14}
                    className="h-3.5 w-3.5 object-contain"
                    unoptimized
                  />
                </div>
              ))}
              {project.stacks.length > 4 && (
                <span className="text-[10px] text-gray-400">+{project.stacks.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isClickable) {
    return (
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full text-inherit no-underline"
      >
        {cardContent}
      </a>
    );
  }

  return cardContent;
};

export default ProjectCard;

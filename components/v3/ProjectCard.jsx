import Image from "next/image";
import { useState } from "react";
import { ExternalLink, ImageOff } from "lucide-react";

const ProjectCard = ({ project, index, isInactive = false }) => {
  const [imageError, setImageError] = useState(false);
  
  const hasImage = project.img && !imageError;
  const hasLink = project.link && project.link !== "/#";
  const isClickable = hasLink && !isInactive;

  const content = (
    <>
      {/* Image area */}
      <div className="relative aspect-[16/10] bg-zinc-100 overflow-hidden border-b border-zinc-200">
        {hasImage ? (
          <Image
            src={project.img}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-400">
            <ImageOff className="w-8 h-8" />
          </div>
        )}
        
        {/* Status badge */}
        <div className="absolute top-2.5 right-2.5">
          {isInactive ? (
            <span className="px-2 py-0.5 text-[10px] font-medium bg-zinc-900 text-white rounded">
              Archived
            </span>
          ) : hasLink ? (
            <span className="px-2 py-0.5 text-[10px] font-medium bg-green-500 text-white rounded">
              Live
            </span>
          ) : null}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-medium text-zinc-900 mb-1 group-hover:text-zinc-600 transition-colors">
          {project.title}
        </h3>
        {project.text && (
          <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
            {project.text}
          </p>
        )}
        
        {/* Tech stack */}
        {project.stacks && project.stacks.length > 0 && (
          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
            {project.stacks.slice(0, 3).map((stack, i) => (
              <span 
                key={i}
                className="px-1.5 py-0.5 text-[10px] font-mono bg-zinc-100 text-zinc-600 rounded"
              >
                {stack.replace('.png', '').replace('.svg', '')}
              </span>
            ))}
            {project.stacks.length > 3 && (
              <span className="text-[10px] text-zinc-400">
                +{project.stacks.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </>
  );

  if (isClickable) {
    return (
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group block border border-zinc-200 hover:border-zinc-300 transition-colors"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="group block border border-zinc-200">
      {content}
    </div>
  );
};

export default ProjectCard;

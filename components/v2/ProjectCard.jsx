import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ImageOff } from "lucide-react";
import { getPortfolioImageUrl } from "../../utils/imageUtils";

const ProjectCard = ({ project, showTechStacks = false, index }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      href={project.link && project.link !== "/#" ? project.link : ""}
      className={`overflow-hidden rounded-lg bg-white shadow-sm ${
        !project.link || project.link === "/#" ? "cursor-default" : ""
      }`}
      target={project.link && project.link !== "/#" ? "_blank" : undefined}
      rel="noopener noreferrer"
      id={`portfolio-item-${index}`}
    >
      {imageError ? (
        <div className="flex h-32 w-full items-center justify-center rounded-lg bg-gray-100 md:h-48">
          <ImageOff className="h-12 w-12 text-gray-400" />
        </div>
      ) : (
        <Image
          src={getPortfolioImageUrl(project)}
          alt={project.title}
          width={300}
          height={200}
          className="h-32 w-full rounded-lg object-cover transition-shadow hover:shadow-md md:h-48"
          unoptimized
          onError={() => setImageError(true)}
        />
      )}
      <div className="p-3 md:p-4">
        <h3 className="text-sm font-medium text-gray-900 hover:underline">
          {project.title}
        </h3>
        <p className="mt-1 text-xs text-gray-500">{project.text}</p>
        {showTechStacks && project.stacks && (
          <div className="mt-2 flex space-x-2">
            {project.stacks.map((stack) => (
              <Image
                key={stack}
                src={`/img/logos/${stack}`}
                alt={stack}
                width={20}
                height={20}
                className="h-5 w-5"
                unoptimized
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProjectCard;

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ImageOff } from "lucide-react";
import { getPortfolioImageUrl } from "../../utils/imageUtils";

const ProjectCard = ({ project, showTechStacks = false, index }) => {
    const [imageError, setImageError] = useState(false);

    return (
        <Link href={project.link && project.link !== "/#" ? project.link : ""} className={`bg-white rounded-lg overflow-hidden shadow-sm ${!project.link || project.link === "/#" ? "cursor-default" : ""}`} target={project.link && project.link !== "/#" ? "_blank" : undefined} rel="noopener noreferrer" id={`portfolio-item-${index}`}>
            {imageError ? (
                <div className="w-full h-32 md:h-48 bg-gray-100 flex items-center justify-center rounded-lg">
                    <ImageOff className="w-12 h-12 text-gray-400" />
                </div>
            ) : (
                <Image
                    src={getPortfolioImageUrl(project)}
                    alt={project.title}
                    width={300}
                    height={200}
                    className="w-full h-32 md:h-48 object-cover rounded-lg hover:shadow-md transition-shadow"
                    unoptimized
                    onError={() => setImageError(true)}
                />
            )}
            <div className="p-3 md:p-4">
                <h3 className="text-sm font-medium text-gray-900 hover:underline">{project.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{project.text}</p>
                {showTechStacks && project.stacks && (
                    <div className="flex space-x-2 mt-2">
                        {project.stacks.map(stack => (
                            <Image key={stack} src={`/img/logos/${stack}`} alt={stack} width={20} height={20} className="w-5 h-5" unoptimized />
                        ))}
                    </div>
                )}
            </div>
        </Link>
    );
};

export default ProjectCard;
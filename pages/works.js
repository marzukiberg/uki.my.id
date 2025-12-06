import Head from "next/head";
import { useState } from "react";
import AppLayout from "../components/AppLayout";
import * as Icons from "lucide-react";

const WorksPage = () => {
    const [activeTab, setActiveTab] = useState("Works");

    const workExperience = [
        {
            id: 1,
            company: "Assist.id",
            website: "https://assist.id",
            position: "Frontend Developer",
            location: "Pekanbaru",
            description: "Modern clinic management application in Pekanbaru that helps thousands of users efficiently manage clinic operations. As a Frontend Developer, I am responsible for developing more than 100 complex features with a focus on clean code and optimal user experience.",
            period: "2023 - Present",
            technologies: ["React", "TypeScript", "Material UI", "Redux"],
            achievements: [
                "Developed over 100+ features for comprehensive clinic management system serving thousands of users",
                "Implemented clean code practices and scalable architecture using modern React patterns",
                "Integrated Material UI components with custom theming for consistent design system",
                "Managed complex state management with Redux for seamless user workflows",
                "Collaborated closely with backend team to ensure robust API integration and data flow"
            ]
        }
    ];

    return (
        <>
            <Head>
                <title>Ukay.dev | Works</title>
            </Head>
            <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <div className="mx-auto">
                    {/* Header — styled like About section */}
                    <section id="works">
                        <div>
                            <h2 className="text-xl font-medium text-blue-800">Work Experience</h2>
                            <p className="mt-2 text-gray-600">
                                A concise timeline of my professional work — projects, roles, and impact. Below are selected highlights showing responsibilities, technologies used, and key achievements.
                            </p>
                        </div>
                    </section>

                    {/* Timeline content */}
                    <div className="mt-8">
                        {workExperience.map((work, index) => (
                            <div key={work.id} className="relative mb-8 md:mb-12">
                                {/* Timeline wrapper for line and dot */}
                                <div className="absolute left-4 md:left-8 top-0 w-0.5 bg-blue-200 h-full">
                                    {/* Timeline dot with icon */}
                                    <div className="absolute -left-2.5 md:-left-3 top-4 md:top-6 w-5 h-5 md:w-6 md:h-6 bg-blue-500 rounded-full border-3 md:border-4 border-white shadow flex items-center justify-center">
                                        <Icons.Briefcase size={10} className="text-white" />
                                    </div>
                                </div>

                                {/* Content card */}
                                <div className="ml-8 md:ml-16 bg-white rounded-lg shadow-md p-4 md:p-6 border border-gray-100">
                                    {/* Period */}
                                    <div className="text-xs md:text-sm font-semibold text-blue-600 mb-2 md:mb-3">
                                        {work.period}
                                    </div>

                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3 md:mb-4">
                                        <div>
                                            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                                                <a
                                                    href={work.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:text-blue-600 transition-colors inline-flex items-center gap-1 md:gap-2"
                                                >
                                                    {work.company}
                                                    <Icons.ExternalLink size={14} className="md:w-4 md:h-4" />
                                                </a>
                                            </h3>
                                            <p className="text-blue-600 font-medium mb-1 md:mb-2 text-sm md:text-base">{work.position}</p>
                                            <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-3">
                                                <Icons.MapPin size={12} className="inline mr-1" />
                                                {work.location}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-gray-700 mb-3 md:mb-4 leading-relaxed text-sm md:text-base">{work.description}</p>

                                    {/* Technologies */}
                                    <div className="mb-3 md:mb-4">
                                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 mb-2">Technologies:</h4>
                                        <div className="flex flex-wrap gap-1 md:gap-2">
                                            {work.technologies.map((tech, techIndex) => (
                                                <span
                                                    key={techIndex}
                                                    className="px-2 md:px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Achievements */}
                                    <div>
                                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 mb-2">Key Achievements:</h4>
                                        <ul className="space-y-1">
                                            {work.achievements.map((achievement, achIndex) => (
                                                <li key={achIndex} className="text-gray-700 text-xs md:text-sm flex items-start">
                                                    <Icons.CheckCircle size={12} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                                    {achievement}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </AppLayout>
        </>
    );
}; export default WorksPage;
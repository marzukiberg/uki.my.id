import Head from "next/head";
import { useState } from "react";
import Link from "next/link";
import SearchLayout from "../components/SearchLayout";
import { Download, Youtube } from "lucide-react";

const ToolsPage = () => {
  const [activeTab, setActiveTab] = useState("Tools");

  const tools = [
    {
      title: "TikTok Downloader",
      description: "Download TikTok videos without watermark",
      icon: Download,
      link: "/tools/tiktok-downloader",
      color: "#1e40af"
    },
    {
      title: "YouTube Downloader",
      description: "Download YouTube videos in multiple formats",
      icon: Youtube,
      link: "/tools/youtube-downloader",
      color: "#dc2626"
    },
  ];

  return (
    <>
      <Head>
        <title>Ukay.dev | Tools</title>
      </Head>
      <SearchLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        <section className="pb-12 sm:pb-16">
          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {tools.map((tool, index) => {
                const IconComponent = tool.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-lg overflow-hidden shadow-sm transition-all duration-300 group"
                    data-aos="fade-up"
                  >
                    <div className="p-4 flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <IconComponent size={40} className="text-gray-700 group-hover:text-blue-600 transition-colors" />
                      </div>
                      <div className="flex-1">
                        <Link
                          href={tool.link}
                          className={`block ${tool.link === "#" ? "cursor-not-allowed opacity-60" : "hover:underline"}`}
                          onClick={tool.link === "#" ? (e) => e.preventDefault() : undefined}
                        >
                          <h3 className="text-base font-semibold text-gray-900 mb-1">{tool.title}</h3>
                        </Link>
                        <p className="text-gray-600 text-xs mb-2">{tool.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </SearchLayout>
    </>
  );
};

export default ToolsPage;
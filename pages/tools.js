import Head from "next/head";
import { useState } from "react";
import Link from "next/link";
import AppLayout from "../components/AppLayout";
import { Download, Youtube } from "lucide-react";

const ToolsPage = () => {
  const [activeTab, setActiveTab] = useState("Tools");

  const tools = [
    {
      title: "TikTok Downloader",
      description: "Download TikTok videos without watermark",
      icon: Download,
      link: "/tools/tiktok-downloader",
      color: "#1e40af",
    },
    {
      title: "YouTube Downloader",
      description: "Download YouTube videos in multiple formats",
      icon: Youtube,
      link: "/tools/youtube-downloader",
      color: "#dc2626",
    },
  ];

  return (
    <>
      <Head>
        <title>Ukay.dev | Tools</title>
      </Head>
      <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        <section className="pb-12 sm:pb-16">
          <div className="relative">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {tools.map((tool, index) => {
                const IconComponent = tool.icon;
                return (
                  <div
                    key={index}
                    className="group overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300"
                    data-aos="fade-up"
                  >
                    <div className="flex items-center space-x-4 p-4">
                      <div className="flex-shrink-0">
                        <IconComponent
                          size={40}
                          className="text-gray-700 transition-colors group-hover:text-blue-600"
                        />
                      </div>
                      <div className="flex-1">
                        <Link
                          href={tool.link}
                          className={`block ${
                            tool.link === "#"
                              ? "cursor-not-allowed opacity-60"
                              : "hover:underline"
                          }`}
                          onClick={
                            tool.link === "#"
                              ? (e) => e.preventDefault()
                              : undefined
                          }
                        >
                          <h3 className="mb-1 text-base font-semibold text-gray-900">
                            {tool.title}
                          </h3>
                        </Link>
                        <p className="mb-2 text-xs text-gray-600">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </AppLayout>
    </>
  );
};

export default ToolsPage;

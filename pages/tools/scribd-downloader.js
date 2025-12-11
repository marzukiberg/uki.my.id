import React, { useState, useEffect } from "react";
import AppLayout from "../../components/AppLayout";
import { TOOLS, SITE_CONFIG } from "../../lib/constants";
import { useMutation } from "@tanstack/react-query";
import DownloaderForm from "../../components/ui/DownloaderForm";
import DownloadButtons from "../../components/ui/DownloadButtons";
import ErrorDisplay from "../../components/ui/ErrorDisplay";
import { BookOpen, Clock, Download } from "lucide-react";

const ScribdDownloaderPage = () => {
    const [activeTab, setActiveTab] = useState("Scribd Downloader");
    const [url, setUrl] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [secret, setSecret] = useState("");
    const [downloadTime, setDownloadTime] = useState(0);
    const [startTime, setStartTime] = useState(null);

    // Mutation for downloading
    const downloadMutation = useMutation({
        mutationFn: async ({ url: downloadUrl, secret: providedSecret }) => {
            setStartTime(Date.now()); // Start timing
            const response = await fetch("/api/scribd-download", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: downloadUrl, secret: providedSecret }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to download document");
            }

            return response;
        },
        onSuccess: async (response) => {
            setStartTime(null); // Stop timing
            // Set result first
            setResult({
                title: "Document",
                description: "Document downloaded successfully",
                isPreview: true,
                downloaded: true,
            });

            // Handle the file download
            const reader = response.body.getReader();
            const chunks = [];

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(value);
            }

            const blob = new Blob(chunks);
            const downloadUrl = URL.createObjectURL(blob);

            // Extract filename from Content-Disposition header or use default
            const contentDisposition = response.headers.get('content-disposition');
            let filename = 'ukaydev_scribd_document.pdf';
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
                if (filenameMatch) {
                    filename = filenameMatch[1].replace(/"/g, '');
                }
            }

            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(downloadUrl);
        },
        onError: (err) => {
            setStartTime(null); // Stop timing
            setError(err.message || "Failed to download document");
        },
    });

    // Derived boolean for whether the download is currently in progress
    const isDownloading = downloadMutation.isPending;

    // Timer effect for download time tracking
    useEffect(() => {
        let interval;
        if (startTime && isDownloading) {
            interval = setInterval(() => {
                setDownloadTime(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        } else {
            setDownloadTime(0);
        }
        return () => clearInterval(interval);
    }, [startTime, isDownloading]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!url.trim()) return;
        downloadMutation.mutate({ url, secret });
    };

    return (
        <AppLayout
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            meta={{
                title: `${TOOLS.scribdDownloader.title} | Download Scribd Documents PDF Free`,
                description: TOOLS.scribdDownloader.description,
                keywords: TOOLS.scribdDownloader.keywords,
                ogImage: `${SITE_CONFIG.url}/img/scribd-og-image.jpg`,
                canonicalPath: TOOLS.scribdDownloader.path,
            }}
        >
            <div className="py-8">
                <div className="mx-auto max-w-2xl px-4">
                    <h1 className="mb-4 flex items-center justify-center space-x-2 text-center text-3xl font-light text-gray-800">
                        <BookOpen className="h-8 w-8" />
                        <span>Document Downloader</span>
                    </h1>
                    <p className="mb-6 text-center text-gray-600">
                        Download documents from Scribd, SlideShare, and Everand
                    </p>
                    {/* Removed duplicate basic info box - prefer badge-based section */}

                    <DownloaderForm
                        url={url}
                        setUrl={setUrl}
                        loading={isDownloading}
                        onSubmit={handleFormSubmit}
                        placeholder="https://www.scribd.com/document/... or slideshare.net or everand.com"
                        showSecret={true}
                        secret={secret}
                        setSecret={setSecret}
                    />

                    {/* Downloading state placed below input and above supported platforms */}
                    {isDownloading && (
                        <div className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>Downloading... {downloadTime}s</span>
                        </div>
                    )}

                    {/* Badge-based supported platforms with spacing from input */}
                    <div className="mt-4 mb-6 rounded-lg bg-white p-4">
                        <div className="flex flex-col items-center justify-center gap-4 text-center">
                            <div>
                                <h3 className="mb-2 font-semibold text-gray-800 text-center">Supported Platforms</h3>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    <span className="inline-flex items-center rounded-full bg-orange-100 px-6 py-3 text-sm md:text-base font-medium text-orange-800">
                                        <BookOpen className="mr-2 h-4 w-4" />
                                        Scribd
                                    </span>
                                    <span className="inline-flex items-center rounded-full bg-blue-100 px-6 py-3 text-sm md:text-base font-medium text-blue-800">
                                        <BookOpen className="mr-2 h-4 w-4" />
                                        SlideShare
                                    </span>
                                    <span className="inline-flex items-center rounded-full bg-green-100 px-6 py-3 text-sm md:text-base font-medium text-green-800">
                                        <BookOpen className="mr-2 h-4 w-4" />
                                        Everand
                                    </span>
                                </div>
                            </div>
                            {/* downloadTime display moved above into its own block */}
                            {/* Small note below badges for Everand support */}
                            <p className="mt-2 text-xs text-gray-500">
                                Note: Everand downloader only supports podcast URLs (e.g. /podcast-show/:id, /podcast/:id, /listen/podcast/:id)
                            </p>
                        </div>
                    </div>

                    <div id="preview-area">
                        <DownloadButtons
                            result={result}
                            downloading={isDownloading}
                            downloadProgress={{ bytes: 0, total: 0, percent: 0 }}
                            platform="scribd"
                            url={url}
                            onDownload={() => downloadMutation.mutate({ url, secret })}
                        />

                        <ErrorDisplay error={error} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default ScribdDownloaderPage;
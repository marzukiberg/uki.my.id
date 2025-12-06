import React, { useState } from "react";
import AppLayout from "../../components/AppLayout";
import { TOOLS, SITE_CONFIG } from "../../lib/constants";
import { useMutation } from "@tanstack/react-query";
import DownloaderForm from "../../components/ui/DownloaderForm";
import DownloadButtons from "../../components/ui/DownloadButtons";
import ErrorDisplay from "../../components/ui/ErrorDisplay";
import { BookOpen } from "lucide-react";

const ScribdDownloaderPage = () => {
    const [activeTab, setActiveTab] = useState("Scribd Downloader");
    const [url, setUrl] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const downloadMutation = useMutation({
        mutationFn: async (downloadUrl) => {
            const response = await fetch("/api/scribd-download", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: downloadUrl }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to download document");
            }

            return response;
        },
        onSuccess: async (response) => {
            // Set result first
            setResult({
                title: "Scribd Document",
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
            setError(err.message || "Failed to download document");
        },
    });

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!url.trim()) return;
        downloadMutation.mutate(url);
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
                        <span>Scribd Downloader</span>
                    </h1>
                    <p className="mb-6 text-center text-gray-600">
                        {TOOLS.scribdDownloader.description}
                    </p>

                    <DownloaderForm
                        url={url}
                        setUrl={setUrl}
                        loading={downloadMutation.isPending}
                        onSubmit={handleFormSubmit}
                        placeholder="https://www.scribd.com/document/..."
                    />

                    <div id="preview-area">
                        <DownloadButtons
                            result={result}
                            downloading={downloadMutation.isPending}
                            downloadProgress={{ bytes: 0, total: 0, percent: 0 }}
                            platform="scribd"
                            url={url}
                            onDownload={() => downloadMutation.mutate(url)}
                        />

                        <ErrorDisplay error={error} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default ScribdDownloaderPage;
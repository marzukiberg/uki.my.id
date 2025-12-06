import React, { useState } from "react";
import AppLayout from "../../components/AppLayout";
import { TOOLS, SITE_CONFIG } from "../../lib/constants";
import { useMutation } from "@tanstack/react-query";
import DownloaderForm from "../../components/ui/DownloaderForm";
import DownloadButtons from "../../components/ui/DownloadButtons";
import ErrorDisplay from "../../components/ui/ErrorDisplay";
import { GraduationCap } from "lucide-react";

const AcademiaDownloaderPage = () => {
    const [activeTab, setActiveTab] = useState("Academia Download");
    const [url, setUrl] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [secret, setSecret] = useState("");

    const downloadMutation = useMutation({
        mutationFn: async ({ url: downloadUrl, secret: providedSecret }) => {
            const response = await fetch("/api/academia-download", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: downloadUrl, secret: providedSecret }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to download paper");
            }

            return response;
        },
        onSuccess: async (response) => {
            // Set result first
            setResult({
                title: "Academic Paper",
                description: "Paper downloaded successfully",
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
            let filename = 'ukaydev_academia_paper.pdf';
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
            setError(err.message || "Failed to download paper");
        },
    });

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
                title: `${TOOLS.academiaDownloader.title} | Download Academia Papers PDF Free`,
                description: TOOLS.academiaDownloader.description,
                keywords: TOOLS.academiaDownloader.keywords,
                ogImage: `${SITE_CONFIG.url}/img/academia-og-image.jpg`,
                canonicalPath: TOOLS.academiaDownloader.path,
            }}
        >
            <div className="py-8">
                <div className="mx-auto max-w-2xl px-4">
                    <h1 className="mb-4 flex items-center justify-center space-x-2 text-center text-3xl font-light text-gray-800">
                        <GraduationCap className="h-8 w-8" />
                        <span>Academia Download</span>
                    </h1>
                    <p className="mb-6 text-center text-gray-600">
                        {TOOLS.academiaDownloader.description}
                    </p>

                    <DownloaderForm
                        url={url}
                        setUrl={setUrl}
                        loading={downloadMutation.isPending}
                        onSubmit={handleFormSubmit}
                        placeholder="https://www.academia.edu/..."
                        showSecret={true}
                        secret={secret}
                        setSecret={setSecret}
                    />

                    <div id="preview-area">
                        <DownloadButtons
                            result={result}
                            downloading={downloadMutation.isPending}
                            downloadProgress={{ bytes: 0, total: 0, percent: 0 }}
                            platform="academia"
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

export default AcademiaDownloaderPage;
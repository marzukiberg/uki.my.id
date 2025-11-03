import { Download, Loader2 } from "lucide-react";
import { Button } from "../v2/Button";
import { formatFileSize } from "../../utils/downloaderUtils";

/**
 * Reusable download buttons component for downloader pages
 * @param {object} props
 * @param {object} props.result - Result data from API
 * @param {boolean} props.downloading - Download in progress state
 * @param {object} props.downloadProgress - Download progress data
 * @param {string} props.selectedFormat - Selected format (YouTube)
 * @param {number} props.activeSlideIndex - Active slide index for carousels
 * @param {boolean} props.isReel - Whether current content is a reel (Instagram)
 * @param {string} props.platform - Platform name for filename generation
 * @param {string} props.url - Original URL for filename generation
 * @param {function} props.onDownload - Custom download handler (YouTube)
 * @param {string} props.className - Additional CSS classes
 */
const DownloadButtons = ({
    result,
    downloading = false,
    downloadProgress = { bytes: 0, total: 0, percent: 0 },
    selectedFormat = "",
    activeSlideIndex = 0,
    isReel = false,
    platform = "media",
    url = "",
    onDownload,
    className = "",
}) => {
    if (!result) return null;

    const getFileExtension = (mediaItem, isAudio = false) => {
        if (isAudio) return "mp3";
        if (mediaItem?.type === "video") return "mp4";
        return "jpg";
    };

    const generateFilename = (index = 0, isAudio = false) => {
        // Extract clean identifier from URL
        let identifier = platform;

        if (platform === "instagram" && url) {
            // For Instagram URLs, extract post ID or username
            // Handle various Instagram URL formats:
            // https://www.instagram.com/p/ABC123/
            // https://www.instagram.com/reel/ABC123/
            // https://www.instagram.com/username/
            const urlParts = url.split('?')[0].split('/').filter(part => part); // Remove query params and empty parts
            const lastPart = urlParts[urlParts.length - 1];

            // If it's a post/reel ID (alphanumeric), use it
            if (lastPart && /^[a-zA-Z0-9_-]+$/.test(lastPart) && lastPart.length > 5) {
                identifier = lastPart;
            } else if (urlParts.includes('p') || urlParts.includes('reel')) {
                // Find the ID after 'p' or 'reel'
                const pIndex = urlParts.indexOf('p');
                const reelIndex = urlParts.indexOf('reel');
                const targetIndex = pIndex !== -1 ? pIndex : reelIndex;
                if (targetIndex !== -1 && urlParts[targetIndex + 1]) {
                    identifier = urlParts[targetIndex + 1];
                }
            }
        } else {
            // For other platforms, use existing logic but clean it up
            const urlParts = url.split('?')[0].split('/').filter(part => part && !part.includes('='));
            identifier = urlParts[urlParts.length - 1] || platform;
        }

        const mediaItem = result.media?.[index] || result.images?.[index];
        const extension = getFileExtension(mediaItem, isAudio);
        return `ukaydev_${identifier}_${index + 1}.${extension}`;
    };

    // Photo carousel download
    if (result.isPhoto && (result.media || result.images)) {
        const mediaArray = result.media || result.images;
        const hasMultiple = mediaArray.length > 1;

        if (hasMultiple) {
            // Multiple photos - download active slide
            return (
                <div className={`mx-auto mt-6 max-w-md ${className}`}>
                    <Button
                        as="a"
                        href={mediaArray[activeSlideIndex]?.url}
                        download={generateFilename(activeSlideIndex)}
                        variant="primary"
                        className="w-full whitespace-nowrap"
                    >
                        Download{" "}
                        {mediaArray[activeSlideIndex]?.type === "video" ? "Video" : "Photo"}{" "}
                        {activeSlideIndex + 1}/{mediaArray.length}
                        {mediaArray[activeSlideIndex]?.size &&
                            ` (${formatFileSize(mediaArray[activeSlideIndex].size)})`}
                    </Button>
                </div>
            );
        } else {
            // Single photo
            return (
                <div className={`mx-auto mt-6 max-w-md ${className}`}>
                    <Button
                        as="a"
                        href={mediaArray[0]?.url}
                        download={generateFilename(0)}
                        variant="primary"
                        className="w-full whitespace-nowrap"
                    >
                        Download {mediaArray[0]?.type === "video" ? "Video" : "Photo"}
                        {mediaArray[0]?.size && ` (${formatFileSize(mediaArray[0].size)})`}
                    </Button>
                </div>
            );
        }
    }

    // Video download (Instagram/TikTok)
    if (!result.isPhoto && result.regularUrl) {
        if (isReel) {
            // Single download button for reels
            return (
                <div className={`mx-auto mt-6 max-w-md ${className}`}>
                    <Button
                        as="a"
                        href={result.regularUrl}
                        download={`ukaydev_${url.split("/").pop() || "reel"}.mp4`}
                        variant="primary"
                        className="w-full whitespace-nowrap"
                    >
                        Download Reel
                        {result.regularSize && ` (${formatFileSize(result.regularSize)})`}
                    </Button>
                </div>
            );
        } else {
            // Two download buttons for regular posts
            return (
                <div className={`mx-auto mt-6 max-w-md ${className}`}>
                    <div className="flex gap-3">
                        <Button
                            as="a"
                            href={result.regularUrl}
                            download={`ukaydev_${url.split("/").pop() || "video"}.mp4`}
                            variant="secondary"
                            className="flex-1 whitespace-nowrap"
                        >
                            Download
                            {result.regularSize && ` (${formatFileSize(result.regularSize)})`}
                        </Button>
                        <Button
                            as="a"
                            href={result.hdUrl}
                            download={`ukaydev_${url.split("/").pop() || "video"}_hd.mp4`}
                            variant="primary"
                            className="flex-1 whitespace-nowrap"
                        >
                            Download HD
                            {result.hdSize && ` (${formatFileSize(result.hdSize)})`}
                        </Button>
                    </div>
                </div>
            );
        }
    }

    // YouTube download with format selection
    if (result.isPreview && selectedFormat) {
        return (
            <div className={`mx-auto mt-6 max-w-md ${className}`}>
                <Button
                    onClick={onDownload || (() => { })}
                    disabled={!selectedFormat || downloading}
                    variant="primary"
                    className="w-full"
                >
                    {downloading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            <span>
                                Downloading... {formatFileSize(downloadProgress.bytes)}
                                {downloadProgress.total > 0 &&
                                    ` / ${formatFileSize(downloadProgress.total)}`}
                                {downloadProgress.percent > 0 &&
                                    ` (${downloadProgress.percent}%)`}
                            </span>
                        </>
                    ) : (
                        <>
                            <Download className="mr-2 h-5 w-5" />
                            <span>
                                Download{" "}
                                {selectedFormat.includes("audio") ||
                                    selectedFormat.includes("bestaudio")
                                    ? "Audio (MP3)"
                                    : "Video (MP4)"}
                            </span>
                        </>
                    )}
                </Button>
            </div>
        );
    }

    return null;
};

export default DownloadButtons;

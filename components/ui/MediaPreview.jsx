import Image from "next/image";
import { useRef } from "react";
import { Play } from "lucide-react";
import PhotoSlider from "./PhotoSlider";

/**
 * Reusable media preview component for downloader pages
 * @param {object} props
 * @param {boolean} props.loading - Loading state
 * @param {object} props.result - Result data from API
 * @param {function} props.onImageClick - Handler for image clicks (lightbox)
 * @param {string} props.className - Additional CSS classes
 */
const MediaPreview = ({
    loading,
    result,
    onImageClick,
    activeIndex,
    onIndexChange,
    className = "",
}) => {
    const sliderRef = useRef(null);

    if (loading) {
        return (
            <div className={`mx-auto mt-6 max-w-md ${className}`}>
                <div className="animate-pulse overflow-hidden rounded-lg bg-gray-100">
                    <div className="aspect-square w-full bg-gray-200"></div>
                </div>
            </div>
        );
    }

    if (!result) return null;

    return (
        <div id="preview-area" className={`mx-auto mt-6 max-w-md ${className}`}>
            <div className="overflow-hidden rounded-lg bg-gray-100">
                {result.isPhoto && (result.media || result.images) ? (
                    // Handle media arrays (photos, videos, or mixed content) - use PhotoSlider component
                    <PhotoSlider
                        images={(result.media || result.images).map((item, index) => ({
                            url: item.url,
                            alt: item.type === "video" ? `Video ${index + 1}` : `Photo ${index + 1}`,
                            type: item.type || "image", // Default to image if no type specified
                        }))}
                        onImageClick={(idx) => {
                            // ensure parent index is synced before invoking image click (e.g., open lightbox)
                            if (typeof onIndexChange === "function") onIndexChange(idx);
                            if (typeof onImageClick === "function") onImageClick(idx);
                        }}
                        activeIndex={activeIndex}
                        onIndexChange={onIndexChange}
                    />
                ) : result.isPreview ? (
                    // Preview mode (YouTube style)
                    <div className="relative">
                        <Image
                            src={result.thumbnail}
                            alt={result.title}
                            width={400}
                            height={225}
                            className="aspect-video h-auto w-full object-cover"
                            unoptimized
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <div className="rounded-full bg-white/90 p-4 backdrop-blur-sm">
                                <Play className="h-8 w-8 text-gray-800" fill="currentColor" />
                            </div>
                        </div>
                        {result.title && (
                            <div className="bg-white p-4">
                                <h3 className="mb-2 line-clamp-2 font-medium text-gray-900">
                                    {result.title}
                                </h3>
                                {result.uploader && (
                                    <p className="mb-1 text-sm text-gray-600">
                                        by {result.uploader}
                                    </p>
                                )}
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                    {result.duration && (
                                        <span>
                                            Duration: {Math.floor(result.duration / 60)}:
                                            {(result.duration % 60).toString().padStart(2, "0")}
                                        </span>
                                    )}
                                    {result.view_count && (
                                        <span>{result.view_count.toLocaleString()} views</span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    // Single video
                    <video
                        controls
                        controlsList="nodownload"
                        className="aspect-square h-auto w-full"
                        src={result.regularUrl || result.videoUrl}
                        poster={result.thumbnail}
                    >
                        Your browser does not support the video tag.
                    </video>
                )}
            </div>
        </div>
    );
};

export default MediaPreview;

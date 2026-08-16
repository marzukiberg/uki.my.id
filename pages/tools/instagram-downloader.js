import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import AppLayout from "../../components/AppLayout";
import DownloaderForm from "../../components/ui/DownloaderForm";
import MediaPreview from "../../components/ui/MediaPreview";
import DownloadButtons from "../../components/ui/DownloadButtons";
import ErrorDisplay from "../../components/ui/ErrorDisplay";
import { useDownloader } from "../../hooks/useDownloader";
import { formatFileSize, scrollToPreview } from "../../utils/downloaderUtils";
import { SITE_CONFIG, TOOLS } from "../../lib/constants";

const InstagramDownloaderPage = () => {
  const {
    activeTab,
    setActiveTab,
    url,
    setUrl,
    loading,
    setLoading,
    result,
    setResult,
    videoInfo,
    setVideoInfo,
    error,
    setError,
    activeSlideIndex,
    setActiveSlideIndex,
    lightboxOpen,
    lightboxIndex,
    setLightboxIndex,
    openLightbox,
    closeLightbox,
    handleSubmit,
  } = useDownloader({
    tabName: "Instagram Downloader",
    hasLightbox: true,
  });

  // Ref for mixed content slider
  const sliderRef = useRef(null);

  // Check if current URL is a reel
  const isReel = url.includes("/reel/");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);
    setVideoInfo(null);
    setActiveSlideIndex(0);

    scrollToPreview();

    try {
      // First, get video information (sizes)
      const infoResponse = await fetch("/api/instagram-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, getInfo: true }),
      });

      if (!infoResponse.ok) {
        const errorData = await infoResponse.json();
        throw new Error(errorData.message || "Failed to get media info");
      }

      const infoData = await infoResponse.json();
      setVideoInfo(infoData);

      // Now download the actual media
      const downloadResponse = await fetch("/api/instagram-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, quality: "best" }),
      });

      if (!downloadResponse.ok) {
        const errorData = await downloadResponse.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to download media");
      }

      // Check if response is JSON (carousel) or blob (single file)
      const contentType = downloadResponse.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        // Carousel with multiple photos
        const carouselData = await downloadResponse.json();

        if (carouselData.isCarousel && carouselData.media) {
          console.log(
            `Got ${carouselData.mediaCount} media files from carousel`
          );

          // Convert base64 data to blob URLs for display (include both photos and videos)
          const mediaItems = carouselData.media.map((mediaItem) => {
            // Convert base64 data URL to blob
            const base64Data = mediaItem.data.split(",")[1];
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: mediaItem.mimeType });

            return {
              url: URL.createObjectURL(blob),
              blob: blob,
              size: mediaItem.size,
              filename: mediaItem.filename,
              type: mediaItem.type, // "photo" or "video"
              mimeType: mediaItem.mimeType,
            };
          });

          setResult({
            isPhoto: true, // Treat as photo carousel (will handle videos in UI)
            media: mediaItems,
            mediaCount: mediaItems.length,
            isCarousel: true,
          });
        }
      } else {
        // Single file (photo or video)
        const blob = await downloadResponse.blob();
        const blobUrl = URL.createObjectURL(blob);

        if (infoData.isPhoto) {
          // Single photo
          setResult({
            isPhoto: true,
            images: [
              {
                url: blobUrl,
                blob: blob,
                size: blob.size,
              },
            ],
            imageCount: 1,
          });
        } else {
          // Single video
          setResult({
            regularUrl: blobUrl,
            hdUrl: blobUrl,
            regularBlob: blob,
            hdBlob: blob,
            regularSize: blob.size,
            hdSize: blob.size,
            isPhoto: false,
          });
        }
      }
    } catch (err) {
      console.error("Error processing Instagram URL:", err);

      // Use the error message from the API if available
      let errorMessage =
        "Failed to process Instagram URL. Please check the URL and try again.";
      if (err.message && err.message !== "Failed to get media info") {
        errorMessage = err.message;
      }

      // Check for specific Instagram-related errors
      if (err.message && err.message.includes("Instagram access blocked")) {
        errorMessage =
          "Instagram has restricted automated downloads. Please try using a web browser or ensure the post is public.";
      } else if (
        err.message &&
        err.message.includes("Unable to download from Instagram")
      ) {
        errorMessage =
          "Unable to access Instagram content. The post may be private, deleted, or Instagram is blocking automated access.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      meta={{
        title: `${TOOLS.instagramDownloader.title} | Download Instagram Photos & Videos Free`,
        description: TOOLS.instagramDownloader.description,
        keywords: TOOLS.instagramDownloader.keywords,
        ogImage: `${SITE_CONFIG.url}/img/instagram-og-image.jpg`,
        canonicalPath: TOOLS.instagramDownloader.path,
      }}
    >
      <div className="py-8">
        <div className="mx-auto max-w-2xl px-4">
          <h1 className="mb-4 flex items-center justify-center space-x-2 text-center text-3xl font-light text-gray-800">
            <Image
              src="https://cdn.jsdelivr.net/gh/selfhst/icons/svg/instagram.svg"
              alt="Instagram"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span>Instagram Downloader</span>
          </h1>
          <p className="mb-6 text-center text-gray-600">
            {TOOLS.instagramDownloader.description}
          </p>
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This tool supports downloading public Instagram posts, including photos, videos, reels, and carousel albums. Ensure the post is publicly accessible for best results.
            </p>
          </div>
          <DownloaderForm
            url={url}
            setUrl={setUrl}
            loading={loading}
            onSubmit={handleFormSubmit}
            placeholder="https://www.instagram.com/p/ABC123... or /reel/ABC123..."
          />

          <div id="preview-area">
            <MediaPreview
              loading={loading}
              result={result}
              onImageClick={openLightbox}
              activeIndex={activeSlideIndex}
              onIndexChange={setActiveSlideIndex}
            />

            <DownloadButtons
              result={result}
              activeSlideIndex={activeSlideIndex}
              isReel={isReel}
              platform="instagram"
              url={url}
            />

            <ErrorDisplay error={error} />
          </div>
        </div>
      </div>

      {/* Lightbox for media viewing */}
      {result &&
        (result.media || result.images) &&
        (result.media || result.images).length > 0 && (
          <Lightbox
            open={lightboxOpen}
            close={closeLightbox}
            index={lightboxIndex}
            slides={(result.media || result.images).map((mediaItem) => ({
              src: mediaItem.url,
              alt: `Instagram Media ${(result.media || result.images).indexOf(mediaItem) + 1
                }`,
              type: mediaItem.type === "video" ? "video" : "image",
            }))}
            on={{
              view: ({ index }) => setLightboxIndex(index),
            }}
            controller={{
              closeOnBackdropClick: true,
              closeOnPullDown: true,
              closeOnPullUp: true,
            }}
            carousel={{
              finite: false,
              preload: 2,
            }}
            render={{
              buttonPrev:
                (result.media || result.images).length > 1
                  ? undefined
                  : () => null,
              buttonNext:
                (result.media || result.images).length > 1
                  ? undefined
                  : () => null,
            }}
            styles={{
              container: {
                backgroundColor: "rgba(0, 0, 0, 0.9)",
                backdropFilter: "blur(10px)",
              },
              slide: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
              image: {
                maxHeight: "90vh",
                maxWidth: "90vw",
                objectFit: "contain",
              },
              video: {
                maxHeight: "90vh",
                maxWidth: "90vw",
                objectFit: "contain",
              },
            }}
          />
        )}
    </AppLayout>
  );
};

export default InstagramDownloaderPage;

import Image from "next/image";
import AppLayout from "../../components/AppLayout";
import DownloadButtons from "../../components/ui/DownloadButtons";
import DownloaderForm from "../../components/ui/DownloaderForm";
import ErrorDisplay from "../../components/ui/ErrorDisplay";
import MediaPreview from "../../components/ui/MediaPreview";
import { useDownloader } from "../../hooks/useDownloader";
import { SITE_CONFIG, TOOLS } from "../../lib/constants";
import { scrollToPreview } from "../../utils/downloaderUtils";

const TikTokDownloaderPage = () => {
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
    handleSubmit,
  } = useDownloader({
    tabName: "TikTok Downloader",
  });

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
      const infoResponse = await fetch("/api/tiktok-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, getInfo: true }),
      });

      if (!infoResponse.ok) {
        const errorData = await infoResponse.json();
        throw new Error(errorData.message || "Failed to get video info");
      }

      const infoData = await infoResponse.json();
      setVideoInfo(infoData);

      // Handle photos vs videos differently
      if (infoData.isPhoto && infoData.imageUrls) {
        // For photos, download all images from the URLs provided
        console.log(`Downloading ${infoData.imageUrls.length} photos...`);

        const imagePromises = infoData.imageUrls.map(
          async (imageUrl, index) => {
            const response = await fetch(imageUrl);
            if (!response.ok) {
              throw new Error(`Failed to download image ${index + 1}`);
            }
            const blob = await response.blob();
            return {
              url: URL.createObjectURL(blob),
              blob: blob,
              size: blob.size,
            };
          }
        );

        const images = await Promise.all(imagePromises);

        setResult({
          isPhoto: true,
          images: images, // Array of {url, blob, size}
          imageCount: images.length,
        });
      } else {
        // For videos, download both regular and HD versions
        const [regularResponse, hdResponse] = await Promise.all([
          fetch("/api/tiktok-download", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url, quality: "worst" }),
          }),
          fetch("/api/tiktok-download", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url, quality: "best" }),
          }),
        ]);

        if (!regularResponse.ok || !hdResponse.ok) {
          const errorData = await regularResponse.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to download video");
        }

        // Convert responses to blobs for video display
        const [regularBlob, hdBlob] = await Promise.all([
          regularResponse.blob(),
          hdResponse.blob(),
        ]);

        const regularUrl = URL.createObjectURL(regularBlob);
        const hdUrl = URL.createObjectURL(hdBlob);

        setResult({
          regularUrl,
          hdUrl,
          regularBlob,
          hdBlob,
          regularSize: regularBlob.size,
          hdSize: hdBlob.size,
          isPhoto: false,
        });
      }
    } catch (err) {
      console.error("Error processing TikTok URL:", err);

      // Use the error message from the API if available
      let errorMessage =
        "Failed to process TikTok URL. Please check the URL and try again.";
      if (err.message && err.message !== "Failed to get video info") {
        errorMessage = err.message;
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
        title: `${TOOLS.tiktokDownloader.title} | Download TikTok Videos Free`,
        description: TOOLS.tiktokDownloader.description,
        keywords: TOOLS.tiktokDownloader.keywords,
        ogImage: `${SITE_CONFIG.url}/img/tiktok-og-image.jpg`,
        canonicalPath: TOOLS.tiktokDownloader.path,
      }}
    >
      <div className="py-8">
        <div className="mx-auto max-w-2xl px-4">
          <h1 className="mb-4 flex items-center justify-center space-x-2 text-center text-3xl font-light text-gray-800">
            <Image
              src="https://cdn.jsdelivr.net/gh/selfhst/icons/svg/tiktok.svg"
              alt="TikTok"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span>TikTok Downloader</span>
          </h1>
          <p className="mb-6 text-center text-gray-600">
            {TOOLS.tiktokDownloader.description}
          </p>

          <DownloaderForm
            url={url}
            setUrl={setUrl}
            loading={loading}
            onSubmit={handleFormSubmit}
            placeholder="https://www.tiktok.com/@username/video/1234567890 or /photo/..."
          />

          <div id="preview-area">
                    <MediaPreview
                      loading={loading}
                      result={result}
                      activeIndex={activeSlideIndex}
                      onIndexChange={setActiveSlideIndex}
                    />

            <DownloadButtons
              result={result}
              activeSlideIndex={activeSlideIndex}
              platform="tiktok"
              url={url}
            />

            <ErrorDisplay error={error} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default TikTokDownloaderPage;

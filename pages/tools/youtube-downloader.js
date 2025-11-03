import Image from "next/image";
import React from "react";
import AppLayout from "../../components/AppLayout";
import DownloadButtons from "../../components/ui/DownloadButtons";
import DownloaderForm from "../../components/ui/DownloaderForm";
import ErrorDisplay from "../../components/ui/ErrorDisplay";
import MediaPreview from "../../components/ui/MediaPreview";
import { BaseSelect } from "../../components/v2/BaseSelect";
import { useDownloader } from "../../hooks/useDownloader";
import { SITE_CONFIG, TOOLS } from "../../lib/constants";
import {
  scrollToPreview
} from "../../utils/downloaderUtils";

const YouTubeDownloaderPage = () => {
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
    selectedFormat,
    setSelectedFormat,
    availableFormats,
    setAvailableFormats,
    downloading,
    setDownloading,
    downloadProgress,
    setDownloadProgress,
    handleSubmit,
    activeSlideIndex,
    setActiveSlideIndex,
  } = useDownloader({
    tabName: "YouTube Downloader",
    hasFormatSelection: true,
    hasDownloadProgress: true,
  });

  // Helper function to format file sizes
  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    if (bytes === 0) return "0 B";

    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  // Helper to estimate filesize from bitrate and duration
  const estimateFileSize = (format, duration) => {
    if (format.filesize) return format.filesize;
    if (format.tbr && duration) {
      // tbr is in kbps, duration in seconds
      // filesize = (bitrate * duration) / 8
      const estimatedBytes = (format.tbr * 1000 * duration) / 8;
      return estimatedBytes;
    }
    return null;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);
    setAvailableFormats([]);

    scrollToPreview();

    try {
      // Get video information and available formats
      const infoResponse = await fetch("/api/youtube-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!infoResponse.ok) {
        const errorData = await infoResponse.json();
        throw new Error(errorData.message || "Failed to get video info");
      }

      const infoData = await infoResponse.json();
      setAvailableFormats(infoData.formats || []);

      console.log("Available formats:", infoData.formats);
      console.log(
        "Formats with filesize:",
        infoData.formats.filter((f) => f.filesize)
      );

      // Set video info for preview
      setResult({
        title: infoData.title,
        duration: infoData.duration,
        thumbnail: infoData.thumbnail,
        uploader: infoData.uploader,
        view_count: infoData.view_count,
        upload_date: infoData.upload_date,
        isPreview: true, // Flag to indicate this is just preview
      });

      // Reset selected format to trigger regeneration
      setSelectedFormat("");
    } catch (err) {
      console.error("Error processing YouTube URL:", err);

      let errorMessage =
        "Failed to process YouTube URL. Please check the URL and try again.";
      if (err.message && err.message !== "Failed to get video info") {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!selectedFormat) return;

    setDownloading(true);
    setDownloadProgress({ bytes: 0, total: 0, percent: 0 });
    setError("");

    try {
      // Download via streaming from our API
      const downloadResponse = await fetch("/api/youtube-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, format: selectedFormat }),
      });

      if (!downloadResponse.ok) {
        const errorData = await downloadResponse.json();
        throw new Error(errorData.message || "Failed to download video");
      }

      // Get total size from headers (try multiple header variations)
      const contentLengthHeader = downloadResponse.headers.get("content-length") ||
                                  downloadResponse.headers.get("Content-Length");
      const contentLength = contentLengthHeader ? parseInt(contentLengthHeader, 10) : null;

      // Validate contentLength is a positive number
      const validContentLength = contentLength && !isNaN(contentLength) && contentLength > 0 ? contentLength : null;

      const reader = downloadResponse.body.getReader();
      const chunks = [];
      let receivedLength = 0;

      // Read stream with progress
      let lastUpdateTime = 0;
      const updateInterval = 100; // Update progress every 100ms

      const readStream = async () => {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          chunks.push(value);
          receivedLength += value.length;

          // Throttle progress updates to avoid too frequent re-renders
          const now = Date.now();
          if (now - lastUpdateTime >= updateInterval) {
            const percent = validContentLength
              ? Math.round((receivedLength / validContentLength) * 100)
              : 0;

            setDownloadProgress({
              bytes: receivedLength,
              total: validContentLength || 0,
              percent: percent,
            });
            lastUpdateTime = now;
          }
        }

        // Final progress update
        const finalPercent = validContentLength
          ? Math.round((receivedLength / validContentLength) * 100)
          : 0;
        setDownloadProgress({
          bytes: receivedLength,
          total: validContentLength || 0,
          percent: finalPercent,
        });
      };

      await readStream();

      // Create blob and download
      const blob = new Blob(chunks);
      const downloadUrl = URL.createObjectURL(blob);

      // Determine file extension based on format
      const isAudio =
        selectedFormat.includes("audio") ||
        selectedFormat.includes("bestaudio");
      const fileExt = isAudio ? "mp3" : "mp4";

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `ukaydev_youtube_${
        result.title ? result.title.replace(/[^a-zA-Z0-9]/g, "_") : "video"
      }.${fileExt}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      // Success
      setResult((prev) => ({ ...prev, downloaded: true }));
    } catch (err) {
      console.error("Error downloading YouTube video:", err);
      setError(err.message || "Failed to download video");
    } finally {
      setDownloading(false);
      // Don't reset progress here - let it show completion status
    }
  };

  // Generate format options from available formats
  const formatOptions = React.useMemo(() => {
    if (!availableFormats.length) {
      return [
        {
          value: "best",
          label: "Best Quality (MP4)",
          description: "Highest quality available",
        },
        {
          value: "best[height<=720]",
          label: "HD 720p (MP4)",
          description: "720p resolution",
        },
        {
          value: "best[height<=480]",
          label: "SD 480p (MP4)",
          description: "480p resolution",
        },
        {
          value: "bestaudio/best",
          label: "Audio Only (MP3)",
          description: "Best audio quality",
        },
        {
          value: "worst",
          label: "Lowest Quality",
          description: "Smallest file size",
        },
      ];
    }

    const options = [];

    // Filter formats: only include formats with BOTH video AND audio
    // YouTube often separates high-quality video and audio streams
    const videoFormats = availableFormats.filter(
      (f) =>
        f.vcodec &&
        f.vcodec !== "none" &&
        f.acodec &&
        f.acodec !== "none" &&
        f.height
    );

    // Filter audio-only formats
    const audioFormats = availableFormats.filter(
      (f) =>
        f.acodec && f.acodec !== "none" && (!f.vcodec || f.vcodec === "none")
    );

    // For very high quality videos that may not have merged streams,
    // we'll use generic selectors that yt-dlp can merge
    const hasOnlyAudioOrVideoStreams = videoFormats.length === 0;

    if (hasOnlyAudioOrVideoStreams) {
      // Use generic format selectors that yt-dlp will merge automatically
      options.push(
        {
          value: "bestvideo[height<=2160]+bestaudio",
          label: "4K (2160p)",
          description: "Highest 4K quality with audio",
        },
        {
          value: "bestvideo[height<=1440]+bestaudio",
          label: "2K (1440p)",
          description: "High 2K quality with audio",
        },
        {
          value: "bestvideo[height<=1080]+bestaudio",
          label: "Full HD (1080p)",
          description: "Full HD quality with audio",
        },
        {
          value: "bestvideo[height<=720]+bestaudio",
          label: "HD (720p)",
          description: "HD quality with audio",
        },
        {
          value: "bestvideo[height<=480]+bestaudio",
          label: "SD (480p)",
          description: "SD quality with audio",
        }
      );
    } else {
      // Use actual format IDs from merged streams
      // Group video formats by resolution
      const resolutionGroups = {};
      videoFormats.forEach((format) => {
        const height = format.height;
        if (!resolutionGroups[height]) {
          resolutionGroups[height] = [];
        }
        resolutionGroups[height].push(format);
      });

      // Sort resolutions descending
      const sortedResolutions = Object.keys(resolutionGroups)
        .map(Number)
        .sort((a, b) => b - a);

      // Add video format options
      sortedResolutions.forEach((height) => {
        const formats = resolutionGroups[height];
        // Pick the best format for this resolution (highest bitrate)
        const bestFormat = formats.reduce((best, current) =>
          (current.tbr || 0) > (best.tbr || 0) ? current : best
        );

        let label = "";
        if (height >= 2160) {
          label = `4K (${height}p)`;
        } else if (height >= 1440) {
          label = `2K (${height}p)`;
        } else if (height >= 1080) {
          label = `Full HD (${height}p)`;
        } else if (height >= 720) {
          label = `HD (${height}p)`;
        } else if (height >= 480) {
          label = `SD (${height}p)`;
        } else {
          label = `${height}p`;
        }

        // Get filesize with fallback to estimation
        const filesize = estimateFileSize(bestFormat, result?.duration);
        const sizeInfo = filesize ? formatFileSize(filesize) : "";

        options.push({
          value: bestFormat.format_id,
          label: `${label} - ${bestFormat.ext.toUpperCase()}${
            sizeInfo ? ` (${sizeInfo})` : ""
          }`,
          description: `${
            bestFormat.resolution || `${bestFormat.width}x${height}`
          }${sizeInfo ? ` • ${sizeInfo}` : ""}`,
        });
      });
    }

    // Add audio option if available (add at the beginning for easy access)
    if (audioFormats.length > 0) {
      const bestAudio = audioFormats.reduce((best, current) =>
        (current.tbr || 0) > (best.tbr || 0) ? current : best
      );

      const filesize = estimateFileSize(bestAudio, result?.duration);
      const sizeInfo = filesize ? formatFileSize(filesize) : "";

      options.unshift({
        value: "bestaudio/best",
        label: `🎵 Audio Only (MP3)${sizeInfo ? ` - ${sizeInfo}` : ""}`,
        description: `Extract audio only${sizeInfo ? ` • ${sizeInfo}` : ""}`,
      });
    }

    // Fallback to generic options if no formats found
    if (options.length === 0) {
      return [
        {
          value: "best",
          label: "Best Quality",
          description: "Highest quality available",
        },
        {
          value: "bestaudio",
          label: "Audio Only",
          description: "Best audio quality",
        },
      ];
    }

    return options;
  }, [availableFormats, result]);

  return (
    <AppLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      meta={{
        title: `${TOOLS.youtubeDownloader.title} | Download YouTube Videos MP4/MP3 Free`,
        description: TOOLS.youtubeDownloader.description,
        keywords: TOOLS.youtubeDownloader.keywords,
        ogImage: `${SITE_CONFIG.url}/img/youtube-og-image.jpg`,
        canonicalPath: TOOLS.youtubeDownloader.path,
      }}
    >
      <div className="py-8">
        <div className="mx-auto max-w-2xl px-4">
          <h1 className="mb-4 flex items-center justify-center space-x-2 text-center text-3xl font-light text-gray-800">
            <Image
              src="https://cdn.jsdelivr.net/gh/selfhst/icons/svg/youtube.svg"
              alt="YouTube"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span>YouTube Downloader</span>
          </h1>
          <p className="mb-6 text-center text-gray-600">
            {TOOLS.youtubeDownloader.description}
          </p>

          <DownloaderForm
            url={url}
            setUrl={setUrl}
            loading={loading}
            onSubmit={handleFormSubmit}
            placeholder="https://www.youtube.com/watch?v=..."
          />

          <div id="preview-area">
            <MediaPreview
              loading={loading}
              result={result}
              activeIndex={activeSlideIndex}
              onIndexChange={setActiveSlideIndex}
            />

            {/* Format Selection & Download */}
            {result && result.isPreview && (
              <div className="mx-auto mt-6 max-w-md space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Select Format
                  </label>
                  <BaseSelect
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    options={formatOptions}
                    placeholder="Choose format..."
                    className="w-full"
                  />
                </div>
              </div>
            )}

            <DownloadButtons
              result={result}
              downloading={downloading}
              downloadProgress={downloadProgress}
              selectedFormat={selectedFormat}
              platform="youtube"
              url={url}
              onDownload={handleDownload}
            />

            <ErrorDisplay error={error} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default YouTubeDownloaderPage;

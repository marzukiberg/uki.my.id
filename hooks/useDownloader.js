import { useState, useEffect } from "react";
import { scrollToPreview, resetDownloaderStates } from "../utils/downloaderUtils";

/**
 * Custom hook for common downloader functionality
 * @param {object} options - Configuration options
 * @param {string} options.tabName - Name of the active tab
 * @param {boolean} options.hasLightbox - Whether to include lightbox state
 * @param {boolean} options.hasFormatSelection - Whether to include format selection
 * @param {boolean} options.hasDownloadProgress - Whether to include download progress
 * @returns {object} Downloader state and handlers
 */
export const useDownloader = (options = {}) => {
  const {
    tabName = "Downloader",
    hasLightbox = false,
    hasFormatSelection = false,
    hasDownloadProgress = false,
  } = options;

  // Common state
  const [activeTab, setActiveTab] = useState(tabName);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [videoInfo, setVideoInfo] = useState(null);
  const [error, setError] = useState("");
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Optional states based on options
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState("best");
  const [availableFormats, setAvailableFormats] = useState([]);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({
    bytes: 0,
    total: 0,
    percent: 0,
  });

  // Reset lightbox state when result changes
  useEffect(() => {
    if (hasLightbox) {
      setLightboxOpen(false);
      setLightboxIndex(0);
    }
  }, [result, hasLightbox]);

  // Lightbox handlers
  const openLightbox = (index = 0) => {
    if (hasLightbox) {
      setLightboxIndex(index);
      setLightboxOpen(true);
    }
  };

  const closeLightbox = () => {
    if (hasLightbox) {
      setLightboxOpen(false);
    }
  };

  // Common form submission handler
  const handleSubmit = async (submitFn) => {
    return async (e) => {
      e.preventDefault();
      if (!url.trim()) return;

      setLoading(true);
      setError("");

      // Reset states
      const setters = {
        setResult,
        setVideoInfo,
        setError,
        setActiveSlideIndex,
        ...(hasLightbox && { setLightboxOpen, setLightboxIndex }),
        ...(hasFormatSelection && { setSelectedFormat, setAvailableFormats }),
        ...(hasDownloadProgress && { setDownloadProgress }),
      };
      resetDownloaderStates(setters);

      scrollToPreview();

      try {
        await submitFn();
      } catch (err) {
        console.error("Error processing URL:", err);
        setError(err.message || "Failed to process URL. Please check the URL and try again.");
      } finally {
        setLoading(false);
      }
    };
  };

  return {
    // State
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

    // Optional states
    ...(hasLightbox && {
      lightboxOpen,
      setLightboxOpen,
      lightboxIndex,
      setLightboxIndex,
      openLightbox,
      closeLightbox,
    }),

    ...(hasFormatSelection && {
      selectedFormat,
      setSelectedFormat,
      availableFormats,
      setAvailableFormats,
    }),

    ...(hasDownloadProgress && {
      downloading,
      setDownloading,
      downloadProgress,
      setDownloadProgress,
    }),

    // Handlers
    handleSubmit,
  };
};
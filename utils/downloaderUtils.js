/**
 * Utility functions for downloader components
 */

/**
 * Format file size in human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes) => {
  if (!bytes) return "";
  if (bytes === 0) return "0 B";

  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
};

/**
 * Estimate file size from bitrate and duration
 * @param {object} format - Format object with tbr (bitrate) and filesize
 * @param {number} duration - Duration in seconds
 * @returns {number|null} Estimated file size in bytes
 */
export const estimateFileSize = (format, duration) => {
  if (format.filesize) return format.filesize;
  if (format.tbr && duration) {
    // tbr is in kbps, duration in seconds
    // filesize = (bitrate * duration) / 8
    const estimatedBytes = (format.tbr * 1000 * duration) / 8;
    return estimatedBytes;
  }
  return null;
};

/**
 * Scroll to preview area after form submission
 */
export const scrollToPreview = () => {
  setTimeout(() => {
    const previewArea = document.getElementById("preview-area");
    if (previewArea) {
      previewArea.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, 100);
};

/**
 * Reset common downloader states
 * @param {object} setters - Object containing setter functions
 */
export const resetDownloaderStates = (setters) => {
  const {
    setResult,
    setVideoInfo,
    setError,
    setActiveSlideIndex,
    setLightboxOpen,
    setLightboxIndex,
    setSelectedFormat,
    setAvailableFormats,
    setDownloadProgress,
  } = setters;

  setResult?.(null);
  setVideoInfo?.(null);
  setError?.("");
  setActiveSlideIndex?.(0);
  setLightboxOpen?.(false);
  setLightboxIndex?.(0);
  setSelectedFormat?.("best");
  setAvailableFormats?.([]);
  setDownloadProgress?.({ bytes: 0, total: 0, percent: 0 });
};
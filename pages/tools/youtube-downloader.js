import Head from 'next/head';
import Script from 'next/script';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { Search, Youtube, Download, Settings, Loader2 } from 'lucide-react';
import { Button } from '../../components/v2/Button';
import { BaseInput } from '../../components/v2/BaseInput';
import { BaseSelect } from '../../components/v2/BaseSelect';
import { IconButton } from '../../components/v2/IconButton';
import SearchLayout from '../../components/SearchLayout';
import { SITE_CONFIG, TOOLS } from '../../lib/constants';

const YouTubeDownloaderPage = () => {
  const [activeTab, setActiveTab] = useState('YouTube Downloader');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({ bytes: 0, total: 0, percent: 0 });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('best');
  const [availableFormats, setAvailableFormats] = useState([]);

  // Helper function to format file sizes
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes === 0) return '0 B';

    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);
    setAvailableFormats([]);

    // Scroll to preview area after a short delay
    setTimeout(() => {
      const previewArea = document.getElementById('preview-area');
      if (previewArea) {
        previewArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);

    try {
      // Get video information and available formats
      const infoResponse = await fetch('/api/youtube-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!infoResponse.ok) {
        const errorData = await infoResponse.json();
        throw new Error(errorData.message || 'Failed to get video info');
      }

      const infoData = await infoResponse.json();
      setAvailableFormats(infoData.formats || []);
      
      console.log('Available formats:', infoData.formats);
      console.log('Formats with filesize:', infoData.formats.filter(f => f.filesize));

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
      setSelectedFormat('');

    } catch (err) {
      console.error('Error processing YouTube URL:', err);

      let errorMessage = 'Failed to process YouTube URL. Please check the URL and try again.';
      if (err.message && err.message !== 'Failed to get video info') {
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
    setError('');

    try {
      // Download via streaming from our API
      const downloadResponse = await fetch('/api/youtube-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, format: selectedFormat }),
      });

      if (!downloadResponse.ok) {
        const errorData = await downloadResponse.json();
        throw new Error(errorData.message || 'Failed to download video');
      }

      // Get total size from headers
      const contentLength = parseInt(downloadResponse.headers.get('content-length'), 10);
      const reader = downloadResponse.body.getReader();
      const chunks = [];
      let receivedLength = 0;

      // Read stream with progress
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        receivedLength += value.length;

        // Update progress with bytes and percentage
        const percent = contentLength ? Math.round((receivedLength / contentLength) * 100) : 0;
        setDownloadProgress({
          bytes: receivedLength,
          total: contentLength,
          percent: percent
        });
      }

      // Create blob and download
      const blob = new Blob(chunks);
      const downloadUrl = URL.createObjectURL(blob);
      
      // Determine file extension based on format
      const isAudio = selectedFormat.includes('audio') || selectedFormat.includes('bestaudio');
      const fileExt = isAudio ? 'mp3' : 'mp4';
      
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `ukaydev_youtube_${result.title ? result.title.replace(/[^a-zA-Z0-9]/g, '_') : 'video'}.${fileExt}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      // Success
      setResult(prev => ({ ...prev, downloaded: true }));

    } catch (err) {
      console.error('Error downloading YouTube video:', err);
      setError(err.message || 'Failed to download video');
    } finally {
      setDownloading(false);
      setDownloadProgress({ bytes: 0, total: 0, percent: 0 });
    }
  };

  // Generate format options from available formats
  const formatOptions = React.useMemo(() => {
    if (!availableFormats.length) {
      return [
        { value: 'best', label: 'Best Quality (MP4)', description: 'Highest quality available' },
        { value: 'best[height<=720]', label: 'HD 720p (MP4)', description: '720p resolution' },
        { value: 'best[height<=480]', label: 'SD 480p (MP4)', description: '480p resolution' },
        { value: 'bestaudio/best', label: 'Audio Only (MP3)', description: 'Best audio quality' },
        { value: 'worst', label: 'Lowest Quality', description: 'Smallest file size' },
      ];
    }

    const options = [];

    // Filter formats: only include formats with BOTH video AND audio
    // YouTube often separates high-quality video and audio streams
    const videoFormats = availableFormats.filter(f => 
      f.vcodec && f.vcodec !== 'none' && 
      f.acodec && f.acodec !== 'none' &&
      f.height
    );

    // Filter audio-only formats
    const audioFormats = availableFormats.filter(f => 
      f.acodec && f.acodec !== 'none' && 
      (!f.vcodec || f.vcodec === 'none')
    );

    // For very high quality videos that may not have merged streams,
    // we'll use generic selectors that yt-dlp can merge
    const hasOnlyAudioOrVideoStreams = videoFormats.length === 0;

    if (hasOnlyAudioOrVideoStreams) {
      // Use generic format selectors that yt-dlp will merge automatically
      options.push(
        { value: 'bestvideo[height<=2160]+bestaudio', label: '4K (2160p)', description: 'Highest 4K quality with audio' },
        { value: 'bestvideo[height<=1440]+bestaudio', label: '2K (1440p)', description: 'High 2K quality with audio' },
        { value: 'bestvideo[height<=1080]+bestaudio', label: 'Full HD (1080p)', description: 'Full HD quality with audio' },
        { value: 'bestvideo[height<=720]+bestaudio', label: 'HD (720p)', description: 'HD quality with audio' },
        { value: 'bestvideo[height<=480]+bestaudio', label: 'SD (480p)', description: 'SD quality with audio' },
      );
    } else {
      // Use actual format IDs from merged streams
      // Group video formats by resolution
      const resolutionGroups = {};
      videoFormats.forEach(format => {
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
      sortedResolutions.forEach(height => {
        const formats = resolutionGroups[height];
        // Pick the best format for this resolution (highest bitrate)
        const bestFormat = formats.reduce((best, current) => 
          (current.tbr || 0) > (best.tbr || 0) ? current : best
        );

        let label = '';
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
        const sizeInfo = filesize ? formatFileSize(filesize) : '';

        options.push({
          value: bestFormat.format_id,
          label: `${label} - ${bestFormat.ext.toUpperCase()}${sizeInfo ? ` (${sizeInfo})` : ''}`,
          description: `${bestFormat.resolution || `${bestFormat.width}x${height}`}${sizeInfo ? ` • ${sizeInfo}` : ''}`
        });
      });
    }

    // Add audio option if available (add at the beginning for easy access)
    if (audioFormats.length > 0) {
      const bestAudio = audioFormats.reduce((best, current) => 
        (current.tbr || 0) > (best.tbr || 0) ? current : best
      );

      const filesize = estimateFileSize(bestAudio, result?.duration);
      const sizeInfo = filesize ? formatFileSize(filesize) : '';

      options.unshift({
        value: 'bestaudio/best',
        label: `🎵 Audio Only (MP3)${sizeInfo ? ` - ${sizeInfo}` : ''}`,
        description: `Extract audio only${sizeInfo ? ` • ${sizeInfo}` : ''}`
      });
    }

    // Fallback to generic options if no formats found
    if (options.length === 0) {
      return [
        { value: 'best', label: 'Best Quality', description: 'Highest quality available' },
        { value: 'bestaudio', label: 'Audio Only', description: 'Best audio quality' },
      ];
    }

    return options;
  }, [availableFormats, result]);

  // Auto-select first format when formats are loaded
  React.useEffect(() => {
    if (formatOptions.length > 0 && !selectedFormat) {
      setSelectedFormat(formatOptions[0].value);
    }
  }, [formatOptions, selectedFormat]);

  return (
    <>
      <Head>
        <title>{TOOLS.youtubeDownloader.title} | Download YouTube Videos MP4/MP3 Free | {SITE_CONFIG.name}</title>
        <meta name="description" content={TOOLS.youtubeDownloader.description} />
        <meta name="keywords" content={TOOLS.youtubeDownloader.keywords} />
        <meta name="robots" content="index, follow" />
        <meta name="author" content={SITE_CONFIG.author} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_CONFIG.url}${TOOLS.youtubeDownloader.path}`} />
        <meta property="og:title" content={`${TOOLS.youtubeDownloader.title} | Download YouTube Videos MP4/MP3 Free`} />
        <meta property="og:description" content={TOOLS.youtubeDownloader.description} />
        <meta property="og:image" content={`${SITE_CONFIG.url}/img/youtube-og-image.jpg`} />
        <meta property="og:site_name" content={SITE_CONFIG.name} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`${SITE_CONFIG.url}${TOOLS.youtubeDownloader.path}`} />
        <meta property="twitter:title" content={`${TOOLS.youtubeDownloader.title} | Download YouTube Videos MP4/MP3 Free`} />
        <meta property="twitter:description" content={TOOLS.youtubeDownloader.description} />
        <meta property="twitter:image" content={`${SITE_CONFIG.url}/img/youtube-og-image.jpg`} />

        {/* Additional SEO */}
        <link rel="canonical" href={`${SITE_CONFIG.url}${TOOLS.youtubeDownloader.path}`} />
        <meta name="theme-color" content="#FF0000" />
      </Head>
      <Script
        src="//pl27916297.effectivegatecpm.com/c0/28/07/c028076d225d26dcc3f66fedb.js"
        strategy="afterInteractive"
      />
      <SearchLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        <div className="py-8">
          <div className="max-w-2xl mx-auto px-4">
            <h1 className="text-3xl font-light text-center mb-4 text-gray-800 flex items-center justify-center space-x-2">
              <Image 
                src="https://cdn.jsdelivr.net/gh/selfhst/icons/svg/youtube.svg" 
                alt="YouTube" 
                width={32} 
                height={32} 
                className="w-8 h-8"
              />
              <span>YouTube Downloader</span>
            </h1>
            <p className="text-center text-gray-600 mb-6">{TOOLS.youtubeDownloader.description}</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center space-x-4 max-w-md mx-auto">
                <BaseInput
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="flex-1"
                  required
                />
                <IconButton
                  type="submit"
                  loading={loading}
                >
                  <Search className="w-5 h-5 text-gray-600" />
                </IconButton>
              </div>
            </form>

            {/* Video Preview */}
            <div id="preview-area" className="mt-6 max-w-md mx-auto">
              {loading && (
                <div className="bg-gray-100 rounded-lg overflow-hidden animate-pulse">
                  <div className="w-full aspect-video bg-gray-200"></div>
                </div>
              )}

              {result && (
                <div className="bg-gray-100 rounded-lg overflow-hidden">
                  {result.isPreview ? (
                    // Show thumbnail preview
                    <div className="relative">
                      <Image
                        src={result.thumbnail}
                        alt={result.title}
                        width={400}
                        height={225}
                        className="w-full h-auto aspect-video object-cover"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-4">
                          <Image 
                            src="https://cdn.jsdelivr.net/gh/selfhst/icons/svg/youtube.svg" 
                            alt="YouTube" 
                            width={32} 
                            height={32} 
                            className="w-8 h-8"
                          />
                        </div>
                      </div>
                      {result.title && (
                        <div className="p-4 bg-white">
                          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{result.title}</h3>
                          {result.uploader && (
                            <p className="text-sm text-gray-600 mb-1">by {result.uploader}</p>
                          )}
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            {result.duration && (
                              <span>Duration: {Math.floor(result.duration / 60)}:{(result.duration % 60).toString().padStart(2, '0')}</span>
                            )}
                            {result.view_count && (
                              <span>{result.view_count.toLocaleString()} views</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Show actual video
                    <video
                      controls
                      controlsList="nodownload"
                      className="w-full h-auto aspect-video"
                      src={result.videoUrl}
                      poster={result.thumbnail}
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              )}
            </div>

            {/* Format Selection & Download */}
            {result && result.isPreview && (
              <div className="mt-6 max-w-md mx-auto space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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

                <Button
                  onClick={handleDownload}
                  disabled={!selectedFormat || downloading}
                  variant="primary"
                  className="w-full"
                >
                  {downloading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      <span>
                        Downloading... {formatFileSize(downloadProgress.bytes)}
                        {downloadProgress.total > 0 && ` / ${formatFileSize(downloadProgress.total)}`}
                        {downloadProgress.percent > 0 && ` (${downloadProgress.percent}%)`}
                      </span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      <span>
                        Download {selectedFormat.includes('audio') || selectedFormat.includes('bestaudio') ? 'Audio (MP3)' : 'Video (MP4)'}
                      </span>
                    </>
                  )}
                </Button>
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl max-w-md mx-auto">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>
      </SearchLayout>
    </>
  );
};

export default YouTubeDownloaderPage;
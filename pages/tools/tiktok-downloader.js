import Head from 'next/head';
import Script from 'next/script';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
// Don't import tns directly to avoid "window is not defined" error
// import { tns } from 'tiny-slider';
import 'tiny-slider/dist/tiny-slider.css';
import { Button } from '../../components/v2/Button';
import { BaseInput } from '../../components/v2/BaseInput';
import { IconButton } from '../../components/v2/IconButton';
import SearchLayout from '../../components/SearchLayout';
import { SITE_CONFIG, TOOLS } from '../../lib/constants';

const TikTokDownloaderPage = () => {
  const [activeTab, setActiveTab] = useState('TikTok Downloader');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [videoInfo, setVideoInfo] = useState(null);
  const [error, setError] = useState('');
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const sliderRef = useRef(null);
  const sliderInstance = useRef(null);

  // Helper function to format file sizes
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes === 0) return '0 B';

    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Initialize slider when result changes
  useEffect(() => {
    if (result && result.isPhoto && sliderRef.current) {
      // Dynamically import tiny-slider only on client-side
      import('tiny-slider').then(({ tns }) => {
        // Destroy existing slider if it exists
        if (sliderInstance.current) {
          sliderInstance.current.destroy();
        }

        // Generate icon HTML from Lucide React components
        const prevIconHTML = renderToStaticMarkup(<ChevronLeft size={18} strokeWidth={2.5} />);
        const nextIconHTML = renderToStaticMarkup(<ChevronRight size={18} strokeWidth={2.5} />);

        // Initialize new slider
        const hasMultipleImages = result.images && result.images.length > 1;
        sliderInstance.current = tns({
          container: sliderRef.current,
          items: 1,
          slideBy: 1,
          autoplay: false,
          controls: hasMultipleImages,
          controlsText: [prevIconHTML, nextIconHTML], // Use custom icon markup
          nav: hasMultipleImages,
          mouseDrag: hasMultipleImages,
          loop: false,
          responsive: {
            640: {
              items: 1
            }
          },
          onInit: () => {
            // Set initial active slide
            setActiveSlideIndex(0);
          }
        });

        // Listen to index changed event
        if (sliderInstance.current && hasMultipleImages) {
          sliderInstance.current.events.on('indexChanged', (info) => {
            setActiveSlideIndex(info.displayIndex - 1);
          });
        }
      });
    }

    // Cleanup on unmount
    return () => {
      if (sliderInstance.current) {
        sliderInstance.current.destroy();
      }
    };
  }, [result]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);
    setVideoInfo(null);
    setActiveSlideIndex(0);

    // Scroll to preview area after a short delay
    setTimeout(() => {
      const previewArea = document.getElementById('preview-area');
      if (previewArea) {
        previewArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);

    try {
      // First, get video information (sizes)
      const infoResponse = await fetch('/api/tiktok-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, getInfo: true }),
      });

      if (!infoResponse.ok) {
        const errorData = await infoResponse.json();
        throw new Error(errorData.message || 'Failed to get video info');
      }

      const infoData = await infoResponse.json();
      setVideoInfo(infoData);

      // Handle photos vs videos differently
      if (infoData.isPhoto && infoData.imageUrls) {
        // For photos, download all images from the URLs provided
        console.log(`Downloading ${infoData.imageUrls.length} photos...`);
        
        const imagePromises = infoData.imageUrls.map(async (imageUrl, index) => {
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
        });

        const images = await Promise.all(imagePromises);

        setResult({
          isPhoto: true,
          images: images, // Array of {url, blob, size}
          imageCount: images.length,
        });
      } else {
        // For videos, download both regular and HD versions
        const [regularResponse, hdResponse] = await Promise.all([
          fetch('/api/tiktok-download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, quality: 'worst' }),
          }),
          fetch('/api/tiktok-download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, quality: 'best' }),
          })
        ]);

        if (!regularResponse.ok || !hdResponse.ok) {
          const errorData = await regularResponse.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to download video');
        }

        // Convert responses to blobs for video display
        const [regularBlob, hdBlob] = await Promise.all([
          regularResponse.blob(),
          hdResponse.blob()
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
      console.error('Error processing TikTok URL:', err);
      
      // Use the error message from the API if available
      let errorMessage = 'Failed to process TikTok URL. Please check the URL and try again.';
      if (err.message && err.message !== 'Failed to get video info') {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{TOOLS.tiktokDownloader.title} | Download TikTok Videos Free | {SITE_CONFIG.name}</title>
        <meta name="description" content={TOOLS.tiktokDownloader.description} />
        <meta name="keywords" content={TOOLS.tiktokDownloader.keywords} />
        <meta name="robots" content="index, follow" />
        <meta name="author" content={SITE_CONFIG.author} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_CONFIG.url}${TOOLS.tiktokDownloader.path}`} />
        <meta property="og:title" content={`${TOOLS.tiktokDownloader.title} | Download TikTok Videos Free`} />
        <meta property="og:description" content={TOOLS.tiktokDownloader.description} />
        <meta property="og:image" content={`${SITE_CONFIG.url}/img/tiktok-og-image.jpg`} />
        <meta property="og:site_name" content={SITE_CONFIG.name} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`${SITE_CONFIG.url}${TOOLS.tiktokDownloader.path}`} />
        <meta property="twitter:title" content={`${TOOLS.tiktokDownloader.title} | Download TikTok Videos Free`} />
        <meta property="twitter:description" content={TOOLS.tiktokDownloader.description} />
        <meta property="twitter:image" content={`${SITE_CONFIG.url}/img/tiktok-og-image.jpg`} />

        {/* Additional SEO */}
        <link rel="canonical" href={`${SITE_CONFIG.url}${TOOLS.tiktokDownloader.path}`} />
        <meta name="theme-color" content={SITE_CONFIG.themeColor} />
      </Head>
      <Script
        src="//pl27916297.effectivegatecpm.com/c0/28/07/c028076d225d26dcc3f66fedb.js"
        strategy="afterInteractive"
      />
      <style jsx global>{`
        .photo-slider {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .slider-container {
          position: relative;
          background: #f8f9fa;
        }
        .slide-item {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 300px;
          padding: 20px;
          background: white;
        }
        .slide-item img {
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        /* Tiny slider custom styles - OVERRIDE DEFAULT */
        .photo-slider .tns-outer {
          position: relative;
          overflow: visible !important;
        }
        
        .photo-slider .tns-controls {
          position: absolute !important;
          top: 50% !important;
          left: 0 !important;
          right: 0 !important;
          width: 100% !important;
          transform: translateY(-50%) !important;
          display: flex !important;
          justify-content: space-between !important;
          pointer-events: none !important;
          z-index: 100 !important;
          padding: 0 8px !important;
        }
        
        .photo-slider .tns-controls button {
          pointer-events: auto !important;
          background: rgba(255, 255, 255, 0.90) !important;
          backdrop-filter: blur(8px) !important;
          color: #374151 !important;
          border: 1px solid rgba(255, 255, 255, 0.4) !important;
          border-radius: 50% !important;
          width: 36px !important;
          height: 36px !important;
          min-width: 36px !important;
          min-height: 36px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
          margin: 0 !important;
          padding: 0 !important;
          opacity: 0.7 !important;
        }
        
        .photo-slider .tns-controls button:hover {
          background: rgba(255, 255, 255, 1) !important;
          opacity: 1 !important;
          transform: scale(1.1) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        }
        
        .photo-slider .tns-controls button:disabled {
          opacity: 0.3 !important;
          cursor: not-allowed !important;
        }
        
        .photo-slider .tns-controls button:disabled:hover {
          background: rgba(255, 255, 255, 0.90) !important;
          transform: none !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
        }
        
        .photo-slider .tns-controls button svg {
          color: #374151 !important;
          width: 18px !important;
          height: 18px !important;
          display: block !important;
        }        .photo-slider .tns-nav {
          position: absolute !important;
          bottom: 20px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          display: flex !important;
          gap: 6px !important;
          background: rgba(0, 0, 0, 0.5) !important;
          backdrop-filter: blur(10px) !important;
          padding: 6px 10px !important;
          border-radius: 16px !important;
          z-index: 100 !important;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
        }
        
        .photo-slider .tns-nav button {
          width: 8px !important;
          height: 8px !important;
          border-radius: 50% !important;
          border: none !important;
          background: rgba(255, 255, 255, 0.4) !important;
          cursor: pointer !important;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
          margin: 0 !important;
          padding: 0 !important;
          font-size: 0 !important;
          text-indent: -9999px !important;
        }
        
        .photo-slider .tns-nav button:hover {
          background: rgba(255, 255, 255, 0.7) !important;
          transform: scale(1.3) !important;
        }
        
        .photo-slider .tns-nav button.tns-nav-active {
          background: rgba(255, 255, 255, 1) !important;
          width: 20px !important;
          border-radius: 4px !important;
          box-shadow: 0 0 6px rgba(255, 255, 255, 0.5) !important;
        }
      `}</style>
      <SearchLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        <div className="py-8">
          <div className="max-w-2xl mx-auto px-4">
            <h1 className="text-3xl font-light text-center mb-4 text-gray-800 flex items-center justify-center space-x-2">
              <Image 
                src="https://cdn.jsdelivr.net/gh/selfhst/icons/svg/tiktok.svg" 
                alt="TikTok" 
                width={32} 
                height={32}
                className="w-8 h-8"
              />
              <span>TikTok Downloader</span>
            </h1>
            <p className="text-center text-gray-600 mb-6">{TOOLS.tiktokDownloader.description}</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center space-x-4 max-w-md mx-auto">
                <BaseInput
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.tiktok.com/@username/video/1234567890 or /photo/..."
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

            {/* Media Preview */}
            <div id="preview-area" className="mt-6 max-w-md mx-auto">
              {loading && (
                <div className="bg-gray-100 rounded-lg overflow-hidden animate-pulse">
                  <div className="w-full aspect-square bg-gray-200"></div>
                </div>
              )}

              {result && (result.images || result.regularUrl) && (
                <div className="bg-gray-100 rounded-lg overflow-hidden">
                  {result.isPhoto && result.images ? (
                    <div className="photo-slider">
                      <div ref={sliderRef} className="slider-container">
                        {result.images.map((image, index) => (
                          <div key={index} className="slide-item">
                            <Image
                              src={image.url}
                              alt={`TikTok Photo ${index + 1}`}
                              width={400}
                              height={400}
                              className="w-full h-auto max-h-96 object-contain"
                              unoptimized // Since we're using blob URLs
                            />
                          </div>
                        ))}
                      </div>
                      {result.images.length > 1 && (
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                          {result.images.length} photos
                        </div>
                      )}
                    </div>
                  ) : (
                    <video
                      controls
                      controlsList="nodownload"
                      className="w-full h-auto aspect-square"
                      src={result.regularUrl}
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              )}
            </div>

            {/* Download Buttons */}
            {result && (result.images || result.regularUrl) && (
              <div className="mt-6 max-w-md mx-auto">
                {result.isPhoto && result.images ? (
                  // Download button for active photo only
                  <div className="space-y-2">
                    {result.images.length > 1 ? (
                      // Show only active slide download button
                      <Button
                        as="a"
                        href={result.images[activeSlideIndex]?.url}
                        download={`ukaydev_${url.split('/').pop() || 'photo'}_${activeSlideIndex + 1}.jpg`}
                        variant="primary"
                        className="w-full whitespace-nowrap"
                      >
                        Download Photo {activeSlideIndex + 1}/{result.images.length}{result.images[activeSlideIndex]?.size && ` (${formatFileSize(result.images[activeSlideIndex].size)})`}
                      </Button>
                    ) : (
                      // Show single download button for single photo
                      <Button
                        as="a"
                        href={result.images[0]?.url}
                        download={`ukaydev_${url.split('/').pop() || 'photo'}.jpg`}
                        variant="primary"
                        className="w-full whitespace-nowrap"
                      >
                        Download Photo{result.images[0]?.size && ` (${formatFileSize(result.images[0].size)})`}
                      </Button>
                    )}
                  </div>
                ) : (
                  // Two download buttons for videos
                  <div className="flex gap-3">
                    <Button
                      as="a"
                      href={result.regularUrl}
                      download={`ukaydev_${url.split('/').pop() || 'video'}.mp4`}
                      variant="secondary"
                      className="flex-1 whitespace-nowrap"
                    >
                      Download{result.regularSize && ` (${formatFileSize(result.regularSize)})`}
                    </Button>
                    <Button
                      as="a"
                      href={result.hdUrl}
                      download={`ukaydev_${url.split('/').pop() || 'video'}_hd.mp4`}
                      variant="primary"
                      className="flex-1 whitespace-nowrap"
                    >
                      Download HD{result.hdSize && ` (${formatFileSize(result.hdSize)})`}
                    </Button>
                  </div>
                )}
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

export default TikTokDownloaderPage;
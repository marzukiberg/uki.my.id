// App-wide constants
export const SITE_CONFIG = {
  name: "Ukay.dev",
  domain: typeof window !== "undefined" ? window.location.hostname : "ukay.dev",
  url:
    typeof window !== "undefined" ? window.location.origin : "https://ukay.dev",
  description: "Frontend Developer Portfolio & Tools",
  author: "Ukay.dev",
  themeColor: "#000000",
};

// Social media and SEO constants
export const SOCIAL_LINKS = {
  github: "https://github.com/marzukiberg",
  linkedin: "https://linkedin.com/in/marzukiberg",
  twitter: "https://x.com/ukay_js",
};

// Tool configurations
export const TOOLS = {
  tiktokDownloader: {
    title: "TikTok Downloader",
    description: "Download TikTok videos and photos without watermark",
    path: "/tools/tiktok-downloader",
    keywords:
      "tiktok downloader, download tiktok videos, tiktok video download, tiktok mp4 download, tiktok no watermark, free tiktok downloader, tiktok slideshow download, tiktok music download",
  },
  youtubeDownloader: {
    title: "YouTube Downloader",
    description:
      "Download YouTube videos in MP4, MP3, and various qualities for free",
    path: "/tools/youtube-downloader",
    keywords:
      "youtube downloader, download youtube videos, youtube video download, youtube mp4 download, youtube mp3 download, youtube hd download, youtube 4k download, free youtube downloader, youtube audio download",
  },
  instagramDownloader: {
    title: "Instagram Downloader",
    description:
      "Download Instagram photos, videos, and reels without watermark",
    path: "/tools/instagram-downloader",
    keywords:
      "instagram downloader, download instagram photos, instagram video download, instagram reels download, instagram stories download, instagram mp4 download, free instagram downloader, instagram photo download, instagram media download",
  },
  scribdDownloader: {
    title: "Scribd Downloader",
    description: "Download documents from Scribd for free",
    path: "/tools/scribd-downloader",
    keywords:
      "scribd downloader, download scribd documents, scribd pdf download, free scribd downloader, scribd document download",
  },
  academiaDownloader: {
    title: "Academia Download",
    description: "Download academic papers from Academia.edu for free",
    path: "/tools/academia-downloader",
    keywords:
      "academia downloader, download academia papers, academia pdf download, free academia downloader, academic paper download",
  },
  bookSearch: {
    title: "Book Search",
    description: "Search for books from various sources and find download links",
    path: "/tools/book-search",
    keywords:
      "book search, find books, download books, free books, pdf books, book finder",
  },
};

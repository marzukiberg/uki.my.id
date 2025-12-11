module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com", "placehold.co", "cdn.jsdelivr.net", "libgen.li"],
  },
  // Increase API timeout for long-running operations like Scribd download
  experimental: {
    // No longer needed in Next.js 13+
  },
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: false,
  },
};

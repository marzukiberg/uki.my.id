/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com", "placehold.co", "cdn.jsdelivr.net", "libgen.li"],
  },
};

module.exports = nextConfig;

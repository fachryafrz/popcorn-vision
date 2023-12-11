/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  swcMinify: true,
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;

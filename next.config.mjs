/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  experimental: {
    staleTimes: {
      dynamic: 30, // in seconds
      static: 300, // in seconds
    },
  },
};

export default nextConfig;

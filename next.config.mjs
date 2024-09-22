/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  experimental: {
    staleTimes: {
      dynamic: 300, // 5 minutes in seconds
      static: 300,
    },
  },
};

export default nextConfig;

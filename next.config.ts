import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/@:username",
        destination: "/user/:username",
      },
    ];
  },
};

export default nextConfig;

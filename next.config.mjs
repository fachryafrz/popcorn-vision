/** @type {import('next').NextConfig} */
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: false,
  workboxOptions: {
    navigateFallback: "/",
    disableDevLogs: true,
  },
});

const nextConfig = {
  reactStrictMode: false,
};

export default withPWA(nextConfig);

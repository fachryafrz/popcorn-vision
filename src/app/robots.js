export default function robots() {
  return {
    rules: {
      userAgent: "*",
      disallow: ["/skeleton", "/welcome"],
    },
    sitemap: process.env.NEXT_PUBLIC_APP_URL,
  };
}

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: "/",
      },
      {
        userAgent: [
          "Twitterbot",
          "facebookexternalhit",
          "facebot",
          "Slackbot",
          "Discordbot",
          "WhatsApp",
          "WhatsAppBot",
          "vercel-og",
          "vercel-favicon",
          "vercel-screenshot",
          "LinkedInBot",
        ],
        disallow: [" "],
      },
    ],
  };
}

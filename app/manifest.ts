import { siteConfig } from "@/config/site";
import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#131720",
    theme_color: "#131720",
    icons: [
      {
        src: "/maskable/maskable_icon_x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/favicon/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/favicon/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

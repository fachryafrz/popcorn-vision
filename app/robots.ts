import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/about",
        "/privacy",
        "/terms",
        "/changelog",
        "/search",
        "/movie/",
        "/tv/",
        "/person/",
        "/company/",
        "/lists",
      ],
      disallow: ["/admin/", "/chat/", "/api/", "/settings/"],
    },
  };
}

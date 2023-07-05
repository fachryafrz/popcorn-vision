import Search from "@/app/search/Search";
import React from "react";

export const metadata = {
  title: "Search TV Series",
  description: process.env.APP_DESC,
  alternates: {
    canonical: process.env.APP_URL,
  },
  openGraph: {
    title: process.env.APP_NAME,
    description: process.env.APP_DESC,
    url: process.env.APP_URL,
    siteName: process.env.APP_NAME,
    images: "/popcorn.png",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: process.env.APP_NAME,
    description: process.env.APP_DESC,
    creator: "@fachryafrz",
    images: "/popcorn.png",
  },
  icons: {
    icon: "/popcorn.png",
    shortcut: "/popcorn.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function page() {
  return <Search />;
}

import React from "react";
import Home from "@/app/page";
import { POPCORN, POPCORN_APPLE } from "@/lib/constants";

export async function generateMetadata() {
  return {
    title: "TV Shows",
    description: process.env.NEXT_PUBLIC_APP_DESC,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/tv`,
    },
    openGraph: {
      title: process.env.NEXT_PUBLIC_APP_NAME,
      description: process.env.NEXT_PUBLIC_APP_DESC,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/tv`,
      siteName: process.env.NEXT_PUBLIC_APP_NAME,
      images: POPCORN,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: process.env.NEXT_PUBLIC_APP_NAME,
      description: process.env.NEXT_PUBLIC_APP_DESC,
      creator: "@fachryafrz",
      images: POPCORN,
    },
    icons: {
      icon: POPCORN,
      shortcut: POPCORN,
      apple: POPCORN_APPLE,
    },
  };
}

export default async function HomeTV() {
  return <Home type={`tv`} />;
}

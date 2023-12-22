export const revalidate = 3600; // revalidate this page every 1 hour

import axios from "axios";
import React from "react";
import HomeSlider from "../components/HomeSlider";
import FilmSlider from "../components/FilmSlider";
import Trending from "../components/Trending";
import providers from "../json/providers.json";
import { getFilms, getGenres, getTrending } from "../api/route";
import Home from "../page";

export async function generateMetadata() {
  return {
    title: "TV Series",
    description: process.env.NEXT_PUBLIC_APP_DESC,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/tv`,
    },
    openGraph: {
      title: process.env.NEXT_PUBLIC_APP_NAME,
      description: process.env.NEXT_PUBLIC_APP_DESC,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/tv`,
      siteName: process.env.NEXT_PUBLIC_APP_NAME,
      images: "/popcorn.png",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: process.env.NEXT_PUBLIC_APP_NAME,
      description: process.env.NEXT_PUBLIC_APP_DESC,
      creator: "@fachryafrz",
      images: "/popcorn.png",
    },
    icons: {
      icon: "/popcorn.png",
      shortcut: "/popcorn.png",
      apple: "/apple-touch-icon.png",
    },
  };
}

export default async function HomeTV() {
  return <Home type={`tv`} />;
}

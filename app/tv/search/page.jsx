import Search from "@/app/search/Search";
import React from "react";

export const metadata = {
  title: "Search TV Series",
  description:
    "Your go-to website for movies and TV shows info. Explore a wide range of titles, with detailed synopses, reviews, cast and crew info. Convenient search functionality makes finding your favorites a breeze. Dive into the world of movies and television with Popcorn Vision.",
  alternates: {
    canonical: "https://www.popcorn.vision",
  },
  openGraph: {
    title: "Popcorn Vision",
    description:
      "Your go-to website for movies and TV shows info. Explore a wide range of titles, with detailed synopses, reviews, cast and crew info. Convenient search functionality makes finding your favorites a breeze. Dive into the world of movies and television with Popcorn Vision.",
    url: "https://www.popcorn.vision",
    siteName: "Popcorn Vision",
    images: "/popcorn.png",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Popcorn Vision",
    description:
      "Your go-to website for movies and TV shows info. Explore a wide range of titles, with detailed synopses, reviews, cast and crew info. Convenient search functionality makes finding your favorites a breeze. Dive into the world of movies and television with Popcorn Vision.",
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

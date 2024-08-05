import React from "react";
import Search from "@/components/Search/";
import { fetchData } from "@/lib/fetch";

export async function generateMetadata() {
  return {
    title: "Search Movies",
    description: process.env.NEXT_PUBLIC_APP_DESC,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/search`,
    },
    openGraph: {
      title: process.env.NEXT_PUBLIC_APP_NAME,
      description: process.env.NEXT_PUBLIC_APP_DESC,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/search`,
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

export default async function page() {
  const { genres: movieGenresData } = await fetchData({
    endpoint: `/genre/movie/list`,
  });
  const languagesData = await fetchData({
    endpoint: `/configuration/languages`,
  });
  const { results: fetchMinYear } = await fetchData({
    endpoint: `/discover/movie`,
    queryParams: {
      sort_by: "primary_release_date.asc",
    },
  });
  const { results: fetchMaxYear } = await fetchData({
    endpoint: `/discover/movie`,
    queryParams: {
      sort_by: "primary_release_date.desc",
    },
  });

  const defaultMaxYear = new Date().getFullYear() + 1;
  const minYear = new Date(fetchMinYear[0].release_date).getFullYear();
  const maxYear = new Date(fetchMaxYear[0].release_date).getFullYear();

  return (
    <Search
      type={`movie`}
      genresData={movieGenresData}
      languagesData={languagesData}
      minYear={minYear}
      maxYear={maxYear > defaultMaxYear ? defaultMaxYear : maxYear}
    />
  );
}

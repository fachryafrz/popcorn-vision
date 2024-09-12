import Search from "@/components/Search/";
import { axios } from "@/lib/axios";
import React, { Suspense } from "react";

export async function generateMetadata() {
  return {
    title: "Search TV Series",
    description: process.env.NEXT_PUBLIC_APP_DESC,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/tv/search`,
    },
    openGraph: {
      title: process.env.NEXT_PUBLIC_APP_NAME,
      description: process.env.NEXT_PUBLIC_APP_DESC,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/tv/search`,
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
  const {
    data: { genres: tvGenresData },
  } = await axios(`/genre/tv/list`);
  const { data: languagesData } = await axios(`/configuration/languages`);
  const {
    data: { results: fetchMinYear },
  } = await axios(`/discover/tv`, {
    params: { sort_by: "first_air_date.asc" },
  });
  const {
    data: { results: fetchMaxYear },
  } = await axios(`/discover/tv`, {
    params: { sort_by: "first_air_date.desc" },
  });

  const defaultMaxYear = new Date().getFullYear() + 1;
  const minYear = new Date(fetchMinYear[0].first_air_date).getFullYear();
  const maxYear = new Date(fetchMaxYear[0].first_air_date).getFullYear();

  return (
    <Suspense>
      <Search
        type={`tv`}
        genresData={tvGenresData}
        languagesData={languagesData}
        minYear={minYear}
        maxYear={maxYear > defaultMaxYear ? defaultMaxYear : maxYear}
      />
    </Suspense>
  );
}

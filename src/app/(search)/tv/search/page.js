import Search from "@/components/Search/";
import { POPCORN, POPCORN_APPLE } from "@/lib/constants";
import { fetchData } from "@/lib/fetch";
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

export default async function page() {
  const { genres: tvGenresData } = await fetchData({
    endpoint: `/genre/tv/list`,
  });
  const languagesData = await fetchData({
    endpoint: `/configuration/languages`,
  });
  const { results: fetchMinYear } = await fetchData({
    endpoint: `/discover/tv`,
    queryParams: {
      sort_by: "first_air_date.asc",
    },
  });
  const { results: fetchMaxYear } = await fetchData({
    endpoint: `/discover/tv`,
    queryParams: {
      sort_by: "first_air_date.desc",
    },
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

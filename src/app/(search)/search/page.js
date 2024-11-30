import Search from "@/components/Search/";
import { fetchData } from "@/lib/fetch";
import { POPCORN, POPCORN_APPLE } from "@/lib/constants";
import dayjs from "dayjs";

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
  const [
    { genres: movieGenresData },
    languagesData,
    {
      results: [fetchMinYear],
    },
    {
      results: [fetchMaxYear],
    },
  ] = await Promise.all([
    fetchData({
      endpoint: `/genre/movie/list`,
    }),
    fetchData({
      endpoint: `/configuration/languages`,
    }),
    fetchData({
      endpoint: `/discover/movie`,
      queryParams: {
        sort_by: "primary_release_date.asc",
      },
    }),
    fetchData({
      endpoint: `/discover/movie`,
      queryParams: {
        sort_by: "primary_release_date.desc",
      },
    }),
  ]);

  const minYear = dayjs(fetchMinYear.release_date).year();
  const maxYear = dayjs(fetchMaxYear.release_date).year();

  return (
    <Search
      type={`movie`}
      genresData={movieGenresData}
      languagesData={languagesData}
      minYear={minYear}
      maxYear={maxYear}
    />
  );
}

import Search from "@/components/Search/";
import { POPCORN, POPCORN_APPLE } from "@/lib/constants";
import dayjs from "dayjs";
import Filters from "@/components/Search/Filter";
import { axios } from "@/lib/axios";
import { movieGenres } from "@/data/movie-genres";
import { languages } from "@/data/languages";

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
    {
      results: [fetchMinYear],
    },
    {
      results: [fetchMaxYear],
    },
  ] = await Promise.all([
    axios
      .get(`/discover/movie`, {
        params: {
          sort_by: "primary_release_date.asc",
        },
      })
      .then(({ data }) => data),

    axios
      .get(`/discover/movie`, {
        params: {
          sort_by: "primary_release_date.desc",
        },
      })
      .then(({ data }) => data),
  ]);

  const minYear = dayjs(fetchMinYear.release_date).year();
  const maxYear = dayjs(fetchMaxYear.release_date).year();

  return (
    <div className={`flex gap-4 lg:px-4`}>
      <h1 className="sr-only">Search Movies</h1>

      <Filters
        type={"movie"}
        genresData={movieGenres}
        minYear={minYear}
        maxYear={maxYear}
        languagesData={languages}
      />

      <Search
        type={`movie`}
        genresData={movieGenres}
        languagesData={languages}
        minYear={minYear}
        maxYear={maxYear}
      />
    </div>
  );
}

import Search from "@/components/Search/";
import { POPCORN, POPCORN_APPLE } from "@/lib/constants";
import dayjs from "dayjs";
import Filters from "@/components/Search/Filter";
import axios from "axios";

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
    axios.get(`/api/genre/movie/list`, {
      baseURL: process.env.NEXT_PUBLIC_APP_URL,
    }).then(({ data }) => data),

    axios.get(`/api/configuration/languages`, {
      baseURL: process.env.NEXT_PUBLIC_APP_URL,
    }).then(({ data }) => data),

    axios.get(`/api/discover/movie`, {
      baseURL: process.env.NEXT_PUBLIC_APP_URL,
      params: {
        sort_by: "primary_release_date.asc",
      },
    }).then(({ data }) => data),

    axios.get(`/api/discover/movie`, {
      baseURL: process.env.NEXT_PUBLIC_APP_URL,
      params: {
        sort_by: "primary_release_date.desc",
      },
    }).then(({ data }) => data),
  ]);

  const minYear = dayjs(fetchMinYear.release_date).year();
  const maxYear = dayjs(fetchMaxYear.release_date).year();

  return (
    <div className={`flex lg:px-4 gap-4`}>
      <h1 className="sr-only">
        Search Movies
      </h1>

      <Filters
        type={'movie'}
        genresData={movieGenresData}
        minYear={minYear}
        maxYear={maxYear}
        languagesData={languagesData}
      />

      <Search
        type={`movie`}
        genresData={movieGenresData}
        languagesData={languagesData}
        minYear={minYear}
        maxYear={maxYear}
      />
    </div>
  );
}

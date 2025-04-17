import Search from "@/components/Search/";
import { POPCORN, POPCORN_APPLE } from "@/lib/constants";
import dayjs from "dayjs";
import Filters from "@/components/Search/Filter";
import { axios } from "@/lib/axios";
import { movieGenres } from "@/data/movie-genres";
import { languages } from "@/data/languages";
import { siteConfig } from "@/config/site";

export async function generateMetadata() {
  return {
    title: `Search Movies`,
    openGraph: {
      title: `Search Movies`,
      url: `${siteConfig.url}/search`,
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

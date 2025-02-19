import Search from "@/components/Search/";
import Filters from "@/components/Search/Filter";
import { POPCORN, POPCORN_APPLE } from "@/lib/constants";
import { axios } from "@/lib/axios";

export async function generateMetadata() {
  return {
    title: "Search TV Shows",
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
  const [
    { genres: tvGenresData },
    languagesData,
    { results: fetchMinYear },
    { results: fetchMaxYear },
  ] = await Promise.all([
    axios.get(`/genre/tv/list`, {}).then(({ data }) => data),

    axios.get(`/configuration/languages`, {}).then(({ data }) => data),

    axios.get(`/discover/tv`, {
      params: {
        sort_by: "first_air_date.asc",
      },
    }).then(({ data }) => data),

    axios.get(`/discover/tv`, {
      params: {
        sort_by: "first_air_date.desc",
      },
    }).then(({ data }) => data),
  ]);

  const defaultMaxYear = new Date().getFullYear() + 1;
  const minYear = new Date(fetchMinYear[0].first_air_date).getFullYear();
  const maxYear = new Date(fetchMaxYear[0].first_air_date).getFullYear();

  return (
    <div className={`flex lg:px-4 gap-4`}>
      <h1 className="sr-only">
        Search TV Shows
      </h1>

      <Filters
        type={'tv'}
        genresData={tvGenresData}
        minYear={minYear}
        maxYear={maxYear}
        languagesData={languagesData}
      />

      <Search
        type={`tv`}
        genresData={tvGenresData}
        languagesData={languagesData}
        minYear={minYear}
        maxYear={maxYear > defaultMaxYear ? defaultMaxYear : maxYear}
      /></div>
  );
}

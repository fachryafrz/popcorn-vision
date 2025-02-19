import React, { Suspense } from "react";
import HomeSlider from "@/components/Film/HomeSlider";
import FilmSlider from "@/components/Film/Slider";
import Trending from "@/components/Film/Trending";
import companies from "../json/companies.json";
import providers from "../json/providers.json";
import moment from "moment";
import { POPCORN } from "@/lib/constants";
import SkeletonSlider from "@/components/Skeleton/main/Slider";
import SkeletonTrending from "@/components/Skeleton/main/Trending";
import SkeletonHomeSlider from "@/components/Skeleton/main/HomeSlider";
import Script from "next/script";
import { axios } from "@/lib/axios";

export async function generateMetadata() {
  return {
    description: process.env.NEXT_PUBLIC_APP_DESC,
    alternates: {
      canonical: process.env.NEXT_PUBLIC_APP_URL,
    },
    openGraph: {
      title: process.env.NEXT_PUBLIC_APP_NAME,
      description: process.env.NEXT_PUBLIC_APP_DESC,
      url: process.env.NEXT_PUBLIC_APP_URL,
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
  };
}

export default async function Home({ type = "movie" }) {
  const isTvPage = type === "tv";

  // Get current date and other date-related variables
  const today = moment().format("YYYY-MM-DD");
  const tomorrow = moment().add(1, "days").format("YYYY-MM-DD");
  const monthsAgo = moment().subtract(1, "months").format("YYYY-MM-DD");
  const monthsLater = moment().add(1, "months").format("YYYY-MM-DD");

  const defaultParams = !isTvPage
    ? {
      region: "US",
      include_adult: false,
      language: "en-US",
      sort_by: "popularity.desc",
      with_original_language: "en",
    }
    : {
      region: "US",
      include_adult: false,
      include_null_first_air_dates: false,
      language: "en-US",
      sort_by: "popularity.desc",
      with_original_language: "en",
    };

  // API Requests
  const [
    genres,
    trending,
    nowPlaying,
    upcoming,
    topRated,
    companiesFilms,
    providersFilms,
  ] = await Promise.all([
    // Genres
    axios.get(`/genre/${type}/list`, {}).then(({ data }) => data.genres),

    // Trending
    // getTrending({ type }).then(({ results }) => results),
    axios.get(`/trending/${type}/week`, {}).then(({ data }) => data.results),

    // Now playing
    axios.get(`/discover/${type}`, {
      params: !isTvPage
        ? {
          ...defaultParams,
          without_genres: 10749,
          "primary_release_date.gte": monthsAgo,
          "primary_release_date.lte": today,
        }
        : {
          ...defaultParams,
          "first_air_date.gte": monthsAgo,
          "first_air_date.lte": today,
        },
    }).then(({ data }) => data),

    // Upcoming
    axios.get(`/discover/${type}`, {
      params: !isTvPage
        ? {
          ...defaultParams,
          without_genres: 10749,
          "primary_release_date.gte": tomorrow,
          "primary_release_date.lte": monthsLater,
        }
        : {
          ...defaultParams,
          "first_air_date.gte": tomorrow,
          "first_air_date.lte": monthsLater,
        },
    }).then(({ data }) => data),

    // Top Rated
    axios.get(`/discover/${type}`, {
      params: {
        ...defaultParams,
        // without_genres: 18,
        sort_by: "vote_count.desc",
      },
    }).then(({ data }) => data),

    // Companies Films
    Promise.all(
      companies.slice(0, 3).map((company) =>
        axios.get(`/discover/${type}`, {
          params: {
            ...defaultParams,
            with_companies: company.id,
          },
        }).then(({ data }) => data),
      ),
    ),

    // Providers Films
    Promise.all(
      providers.slice(0, 3).map((provider) =>
        axios.get(`/discover/${type}`, {
          params: {
            ...defaultParams,
            with_networks: provider.id,
          },
        }).then(({ data }) => data),
      ),
    ),
  ]);

  const [homeSliderData, genresFilms] = await Promise.all([
    // Home Slider Films
    Promise.all(
      trending.slice(0, 5).map((film) =>
        axios.get(`/${type}/${film.id}`, {
          params: {
            append_to_response: "images",
          },
        }).then(({ data }) => data),
      ),
    ),

    // Genres Films
    Promise.all(
      genres.slice(0, 3).map((genre) =>
        axios.get(`/discover/${type}`, {
          params: {
            ...defaultParams,
            with_genres: genre.id,
          },
        }).then(({ data }) => data),
      ),
    ),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": process.env.NEXT_PUBLIC_APP_URL,
    url: process.env.NEXT_PUBLIC_APP_URL,
    name: process.env.NEXT_PUBLIC_APP_NAME,
    description: process.env.NEXT_PUBLIC_APP_DESC,
    potentialAction: [
      {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL}/search?query={search_term_string}`,
        },
        "query-input": {
          "@type": "PropertyValueSpecification",
          valueRequired: true,
          valueName: "search_term_string",
        },
      },
    ],
    inLanguage: "en-US",
  };

  return (
    <>
      <h1 className="sr-only">{process.env.NEXT_PUBLIC_APP_NAME}</h1>
      <p className="sr-only">{process.env.NEXT_PUBLIC_APP_DESC}</p>
      <div className="-mt-[66px]">
        <Suspense fallback={<SkeletonHomeSlider />}>
          <HomeSlider
            films={trending.slice(0, 5)}
            genres={genres}
            filmData={homeSliderData}
          />
        </Suspense>
      </div>

      <div className={`flex flex-col gap-4 lg:-mt-[5rem]`}>
        {/* Now Playing */}
        <Suspense fallback={<SkeletonSlider />}>
          <FilmSlider
            films={nowPlaying}
            title={!isTvPage ? `Now Playing` : `On The Air`}
            genres={genres}
            viewAll={`${!isTvPage ? `/search` : `/tv/search`}?release_date=${monthsAgo}..${today}`}
          />
        </Suspense>

        {/* Upcoming */}
        <Suspense fallback={<SkeletonSlider />}>
          <FilmSlider
            films={upcoming}
            title={`Upcoming`}
            genres={genres}
            sort={"ASC"}
            viewAll={`${!isTvPage ? `/search` : `/tv/search`}?release_date=${tomorrow}..${monthsLater}`}
          />
        </Suspense>

        {/* Top Rated */}
        <Suspense fallback={<SkeletonSlider />}>
          <FilmSlider
            films={topRated}
            title={`Top Rated`}
            genres={genres}
            viewAll={`${!isTvPage ? `/search` : `/tv/search`
              }?sort_by=vote_count.desc`}
          />
        </Suspense>

        {/* Trending */}
        <section id="Trending" className="py-[2rem]">
          <Suspense fallback={<SkeletonTrending />}>
            <Trending film={trending[5]} genres={genres} type={type} />
          </Suspense>
        </section>

        {/* Companies / Providers */}
        {!isTvPage
          ? companies
            .slice(0, 3)
            .map((company, index) => (
              <FilmSlider
                key={company.id}
                films={companiesFilms[index]}
                title={company.name}
                genres={genres}
                viewAll={`${!isTvPage ? `/search` : `/tv/search`
                  }?with_companies=${company.id}`}
              />
            ))
          : providers
            .slice(0, 3)
            .map((provider, index) => (
              <FilmSlider
                key={provider.id}
                films={providersFilms[index]}
                title={provider.name}
                genres={genres}
              />
            ))}

        {/* Trending */}
        <section
          id={`Trending ${trending[6].title ?? trending[6].name}`}
          className="py-[2rem]"
        >
          <Suspense fallback={<SkeletonTrending />}>
            <Trending film={trending[6]} genres={genres} type={type} />
          </Suspense>
        </section>

        {/* Genres */}
        {genres.slice(0, 3).map((genre, index) => (
          <FilmSlider
            key={genre.id}
            films={genresFilms[index]}
            title={genre.name}
            genres={genres}
            viewAll={`${!isTvPage ? `/search` : `/tv/search`}?with_genres=${genre.id
              }`}
          />
        ))}

        {/* Trending */}
        <section id="Trending" className="py-[2rem]">
          <Suspense fallback={<SkeletonTrending />}>
            <Trending film={trending[7]} genres={genres} type={type} />
          </Suspense>
        </section>
      </div>

      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}

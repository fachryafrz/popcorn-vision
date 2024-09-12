import React from "react";
import HomeSlider from "@/components/Film/HomeSlider";
import FilmSlider from "@/components/Film/Slider";
import Trending from "@/components/Film/Trending";
import companies from "../json/companies.json";
import providers from "../json/providers.json";
import moment from "moment";
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
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/apple-touch-icon.png",
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

  // API Requests
  const {
    data: { genres },
  } = await axios(`/genre/${type}/list`);
  const {
    data: { results: trending },
  } = await axios(`/trending/${type}/day`);

  const fetchTrendingFilmsData = async () => {
    const data = await Promise.all(
      trending.slice(0, 5).map(async (item) => {
        const { data: filmData } = await axios(`/${type}/${item.id}`, {
          params: { append_to_response: "images" },
        });

        return filmData;
      }),
    );

    return data;
  };

  const defaultParams = !isTvPage
    ? {
        region: "US",
        include_adult: false,
        language: "en-US",
        sort_by: "popularity.desc",
      }
    : {
        region: "US",
        include_adult: false,
        include_null_first_air_dates: false,
        language: "en-US",
        sort_by: "popularity.desc",
      };

  return (
    <>
      <h1 className="sr-only">{process.env.NEXT_PUBLIC_APP_NAME}</h1>
      <HomeSlider
        films={trending.slice(0, 5)}
        genres={genres}
        filmData={await fetchTrendingFilmsData()}
      />

      <div className={`lg:-mt-[5rem]`}>
        {/* Now Playing */}
        <FilmSlider
          films={await axios(`/discover/${type}`, {
            params: !isTvPage
              ? {
                  ...defaultParams,
                  without_genres: 18,
                  "primary_release_date.gte": monthsAgo,
                  "primary_release_date.lte": today,
                }
              : {
                  ...defaultParams,
                  without_genres: 18,
                  "first_air_date.gte": monthsAgo,
                  "first_air_date.lte": today,
                },
          }).then(({ data }) => data)}
          title={!isTvPage ? `Now Playing` : `On The Air`}
          genres={genres}
          viewAll={`${!isTvPage ? `/search` : `/tv/search`}?release_date=${monthsAgo}..${today}`}
        />

        {/* Upcoming */}
        <FilmSlider
          films={await axios(`/discover/${type}`, {
            params: !isTvPage
              ? {
                  ...defaultParams,
                  without_genres: 18,
                  "primary_release_date.gte": tomorrow,
                  "primary_release_date.lte": monthsLater,
                }
              : {
                  ...defaultParams,
                  without_genres: 18,
                  "first_air_date.gte": tomorrow,
                  "first_air_date.lte": monthsLater,
                },
          }).then(({ data }) => data)}
          title={`Upcoming`}
          genres={genres}
          sort={"ASC"}
          viewAll={`${!isTvPage ? `/search` : `/tv/search`}?release_date=${tomorrow}..${monthsLater}`}
        />

        {/* Top Rated */}
        <FilmSlider
          films={await axios(`/discover/${type}`, {
            params: {
              ...defaultParams,
              // without_genres: 18,
              sort_by: "vote_count.desc",
            },
          }).then(({ data }) => data)}
          title={`Top Rated`}
          genres={genres}
          viewAll={`${
            !isTvPage ? `/search` : `/tv/search`
          }?sort_by=vote_count.desc`}
        />

        {/* Trending */}
        <section id="Trending" className="py-[2rem]">
          <Trending film={trending[5]} genres={genres} />
        </section>

        {/* Companies / Providers */}
        {!isTvPage
          ? companies.slice(0, 3).map(async (company) => (
              <FilmSlider
                key={company.id}
                films={await axios(`/discover/${type}`, {
                  params: {
                    ...defaultParams,
                    with_companies: company.id,
                  },
                }).then(({ data }) => data)}
                title={company.name}
                genres={genres}
                viewAll={`${
                  !isTvPage ? `/search` : `/tv/search`
                }?with_companies=${company.id}`}
              />
            ))
          : providers.slice(0, 3).map(async (provider) => (
              <FilmSlider
                key={provider.id}
                films={await axios(`/discover/${type}`, {
                  params: {
                    ...defaultParams,
                    with_networks: provider.id,
                  },
                }).then(({ data }) => data)}
                title={provider.name}
                genres={genres}
              />
            ))}

        {/* Trending */}
        <section id="Trending" className="py-[2rem]">
          <Trending film={trending[6]} genres={genres} />
        </section>

        {/* Genres */}
        {genres.slice(0, 3).map(async (genre) => (
          <FilmSlider
            key={genre.id}
            films={await axios(`/discover/${type}`, {
              params: {
                ...defaultParams,
                with_genres: genre.id,
              },
            }).then(({ data }) => data)}
            title={genre.name}
            genres={genres}
            viewAll={`${!isTvPage ? `/search` : `/tv/search`}?with_genres=${
              genre.id
            }`}
          />
        ))}

        {/* Trending */}
        <section id="Trending" className="py-[2rem]">
          <Trending film={trending[7]} genres={genres} />
        </section>
      </div>
    </>
  );
}

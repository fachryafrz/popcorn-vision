import React from "react";
import HomeSlider from "@/components/Film/HomeSlider";
import FilmSlider from "@/components/Film/FilmSlider";
import Trending from "@/components/Film/Trending";
import companies from "../json/companies.json";
import providers from "../json/providers.json";
import { fetchData, getTrending } from "@/lib/fetch";
import { calculateDate } from "@/lib/formatDate";

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
      icon: "/popcorn.png",
      shortcut: "/popcorn.png",
      apple: "/apple-touch-icon.png",
    },
  };
}

export default async function Home({ type = "movie" }) {
  const isTvPage = type === "tv";

  // Get current date and other date-related variables
  const currentDate = new Date();
  const today = calculateDate({ date: currentDate });
  const tomorrow = calculateDate({ date: currentDate, days: 1 });
  const monthsAgo = calculateDate({ date: currentDate, months: -1 });
  const monthsLater = calculateDate({ date: currentDate, months: 1 });

  // API Requests
  const { genres } = await fetchData({
    endpoint: `/genre/${type}/list`,
  });
  const { results: trending } = await getTrending({ type });

  let trendingFilmsData = [];

  trending.slice(0, 5).forEach(async (item, index) => {
    const filmData = await fetchData({
      endpoint: `/${type}/${item.id}`,
      queryParams: {
        append_to_response: "images",
      },
    });

    trendingFilmsData.push(filmData);
  });

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

  // NOTE: Nanti coba implementasi Suspense

  return (
    <>
      <h1 className="sr-only">{process.env.NEXT_PUBLIC_APP_NAME}</h1>
      <HomeSlider
        films={trending.slice(0, 5)}
        genres={genres}
        filmData={trendingFilmsData}
      />

      <div className={`lg:-mt-[5rem]`}>
        {/* Now Playing */}
        <FilmSlider
          films={await fetchData({
            endpoint: `/discover/${type}`,
            queryParams: !isTvPage
              ? {
                  ...defaultParams,
                  "primary_release_date.gte": monthsAgo,
                  "primary_release_date.lte": today,
                }
              : {
                  ...defaultParams,
                  "first_air_date.gte": monthsAgo,
                  "first_air_date.lte": today,
                },
          })}
          title={!isTvPage ? `Now Playing` : `On The Air`}
          genres={genres}
          viewAll={`${!isTvPage ? `/search` : `/tv/search`}?o=${
            !isTvPage ? `now_playing` : `on_the_air`
          }`}
        />

        {/* Upcoming */}
        <FilmSlider
          films={await fetchData({
            endpoint: `/discover/${type}`,
            queryParams: !isTvPage
              ? {
                  ...defaultParams,
                  "primary_release_date.gte": tomorrow,
                  "primary_release_date.lte": monthsLater,
                }
              : {
                  ...defaultParams,
                  "first_air_date.gte": tomorrow,
                  "first_air_date.lte": monthsLater,
                },
          })}
          title={`Upcoming`}
          genres={genres}
          sort={"ASC"}
          viewAll={`${!isTvPage ? `/search` : `/tv/search`}?o=upcoming`}
        />

        {/* Top Rated */}
        <FilmSlider
          films={await fetchData({
            endpoint: `/discover/${type}`,
            queryParams: {
              ...defaultParams,
              sort_by: "vote_count.desc",
            },
          })}
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
                films={await fetchData({
                  endpoint: `/discover/${type}`,
                  queryParams: {
                    ...defaultParams,
                    with_companies: company.id,
                  },
                })}
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
                films={await fetchData({
                  endpoint: `/discover/${type}`,
                  queryParams: {
                    ...defaultParams,
                    with_networks: provider.id,
                  },
                })}
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
            films={await fetchData({
              endpoint: `/discover/${type}`,
              queryParams: {
                ...defaultParams,
                with_genres: genre.id,
              },
            })}
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

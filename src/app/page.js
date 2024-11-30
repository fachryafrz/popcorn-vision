import React, { Suspense } from "react";
import HomeSlider from "@/components/Film/HomeSlider";
import FilmSlider from "@/components/Film/Slider";
import Trending from "@/components/Film/Trending";
import companies from "../json/companies.json";
import providers from "../json/providers.json";
import { fetchData, getTrending } from "@/lib/fetch";
import moment from "moment";
import { POPCORN } from "@/lib/constants";
import NowPlaying from "@/components/Layout/Home/NowPlaying";
import SkeletonSlider from "@/components/Skeleton/main/Slider";
import Upcoming from "@/components/Layout/Home/Upcoming";
import TopRated from "@/components/Layout/Home/TopRated";
import SkeletonTrending from "@/components/Skeleton/main/Trending";
import SkeletonHomeSlider from "@/components/Skeleton/main/HomeSlider";
import HomeSliderFetch from "@/components/Layout/Home/HomeSliderFetch";

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

  // API Requests
  const [{ genres }, { results: trending }] = await Promise.all([
    fetchData({
      endpoint: `/genre/${type}/list`,
    }),
    getTrending({ type }),
  ]);

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
      <p className="sr-only">{process.env.NEXT_PUBLIC_APP_DESC}</p>
      <div className="-mt-[66px]">
        <Suspense fallback={<SkeletonHomeSlider />}>
          <HomeSliderFetch trending={trending} type={type} genres={genres} />
        </Suspense>
      </div>

      <div className={`flex flex-col gap-4 lg:-mt-[5rem]`}>
        {/* Now Playing */}
        <Suspense fallback={<SkeletonSlider />}>
          <NowPlaying
            type={type}
            defaultParams={defaultParams}
            genres={genres}
          />
        </Suspense>

        {/* Upcoming */}
        <Suspense fallback={<SkeletonSlider />}>
          <Upcoming type={type} defaultParams={defaultParams} genres={genres} />
        </Suspense>

        {/* Top Rated */}
        <Suspense fallback={<SkeletonSlider />}>
          <TopRated type={type} defaultParams={defaultParams} genres={genres} />
        </Suspense>

        {/* Trending */}
        <section id="Trending" className="py-[2rem]">
          <Suspense fallback={<SkeletonTrending />}>
            <Trending film={trending[5]} genres={genres} type={type} />
          </Suspense>
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
        <section
          id={`Trending ${trending[6].title ?? trending[6].name}`}
          className="py-[2rem]"
        >
          <Suspense fallback={<SkeletonTrending />}>
            <Trending film={trending[6]} genres={genres} type={type} />
          </Suspense>
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
          <Suspense fallback={<SkeletonTrending />}>
            <Trending film={trending[7]} genres={genres} type={type} />
          </Suspense>
        </section>
      </div>
    </>
  );
}

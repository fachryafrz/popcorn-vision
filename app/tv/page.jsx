export const revalidate = 3600; // revalidate this page every 1 hour

import axios from "axios";
import React from "react";
import HomeSlider from "../components/HomeSlider";
import FilmSlider from "../components/FilmSlider";
import Trending from "../components/Trending";
import providers from "../json/providers.json";
import { getFilms, getGenres, getTrending } from "../api/route";

export async function generateMetadata() {
  return {
    title: "TV Series",
    description: process.env.NEXT_PUBLIC_APP_DESC,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/tv`,
    },
    openGraph: {
      title: process.env.NEXT_PUBLIC_APP_NAME,
      description: process.env.NEXT_PUBLIC_APP_DESC,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/tv`,
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

export default async function Home() {
  // Get current date and other date-related variables
  const currentDate = new Date();
  const today = currentDate.toISOString().slice(0, 10);
  const firstDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    2
  )
    .toISOString()
    .slice(0, 10);
  const tomorrow = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() + 2
  )
    .toISOString()
    .slice(0, 10);
  const thirtyDaysAgo = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    2
  )
    .toISOString()
    .slice(0, 10);
  const currentYear = currentDate.getFullYear();
  const endOfYear = new Date(currentYear, 11, 32).toISOString().slice(0, 10);

  // API Requests
  const genres = await getGenres({ type: `tv` });

  const params = ({
    date_gte,
    date_lte,
    apiCompanies = "2739|213|49|1024|453",
    apiGenres,
    apiSortBy = "popularity.desc",
  }) => {
    return {
      watch_region: "US",
      // with_watch_providers: "8|9|49|337",
      include_adult: false,
      include_null_first_air_dates: false,
      language: "en-US",
      sort_by: apiSortBy,
      "first_air_date.gte": date_gte,
      "first_air_date.lte": date_lte,
      with_networks: apiCompanies,
      with_genres: apiGenres,
    };
  };

  return (
    <>
      <h1 className="sr-only">{`Popcorn Vision - TV Series`}</h1>
      <HomeSlider films={await getTrending({ type: `tv` })} genres={genres} />
      <div className={`lg:-mt-[6rem]`}>
        {/* On The Air */}
        <FilmSlider
          films={await getFilms({
            endpoint: "/discover/tv",
            params: params({
              date_gte: thirtyDaysAgo,
              date_lte: today,
            }),
          })}
          title={`On The Air`}
          genres={genres}
        />

        {/* Upcoming */}
        <FilmSlider
          films={await getFilms({
            endpoint: "/discover/tv",
            params: params({
              date_gte: tomorrow,
              date_lte: endOfYear,
            }),
          })}
          title={`Upcoming`}
          genres={genres}
          sort={"ASC"}
        />

        {/* Top Rated */}
        <FilmSlider
          films={await getFilms({
            endpoint: "/discover/tv",
            params: params({
              apiSortBy: "vote_count.desc",
            }),
          })}
          title={`Top Rated`}
          genres={genres}
        />

        {/* Trending */}
        <section id="Trending" className="py-[2rem]">
          <Trending
            film={await getTrending({ num: 6, type: `tv` })}
            genres={genres}
          />
        </section>

        {/* Providers */}
        {providers.slice(0, 3).map(async (provider) => (
          <FilmSlider
            key={provider.id}
            films={await getFilms({
              endpoint: "/discover/tv",
              params: params({
                apiCompanies: provider.id,
              }),
            })}
            title={provider.name}
            genres={genres}
          />
        ))}

        {/* Trending */}
        <section id="Trending" className="py-[2rem]">
          <Trending
            film={await getTrending({ num: 7, type: `tv` })}
            genres={genres}
          />
        </section>

        {/* Genres */}
        {genres.slice(0, 3).map(async (genre) => (
          <FilmSlider
            key={genre.id}
            films={await getFilms({
              endpoint: "/discover/tv",
              params: params({
                apiGenres: genre.id,
              }),
            })}
            title={genre.name}
            genres={genres}
          />
        ))}

        {/* Trending */}
        <section id="Trending" className="py-[2rem]">
          <Trending
            film={await getTrending({ num: 8, type: `tv` })}
            genres={genres}
          />
        </section>
      </div>{" "}
    </>
  );
}

export const revalidate = 3600; // revalidate this page every 1 hour

import axios from "axios";
import React from "react";
import HomeSlider from "./components/HomeSlider";
import FilmSlider from "./components/FilmSlider";
import Trending from "./components/Trending";
import companies from "./json/companies.json";
import { getFilms, getGenres, getTrending } from "./api/route";

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

export default async function Home() {
  // Get current date and other date-related variables
  const currentDate = new Date();
  const today = currentDate.toISOString().slice(0, 10);

  const tomorrow = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() + 2
  )
    .toISOString()
    .slice(0, 10);

  const firstDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    2
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
  const genres = await getGenres({ type: `movie` });

  const params = ({
    date_gte,
    date_lte,
    apiCompanies,
    apiGenres,
    apiSortBy = "popularity.desc",
  }) => {
    return {
      region: "US",
      include_adult: false,
      language: "en-US",
      sort_by: apiSortBy,
      with_companies: apiCompanies,
      with_genres: apiGenres,
      "primary_release_date.gte": date_gte,
      "primary_release_date.lte": date_lte,
    };
  };
  return (
    <>
      <h1 className="sr-only">{`Popcorn Vision`}</h1>
      <HomeSlider
        films={await getTrending({ type: "movie" })}
        genres={genres}
      />

      <div className={`lg:-mt-[5rem]`}>
        {/* Now Playing */}
        <FilmSlider
          films={await getFilms({
            endpoint: "/discover/movie",
            params: params({
              date_gte: thirtyDaysAgo,
              date_lte: today,
            }),
          })}
          title={`Now Playing`}
          genres={genres}
        />
  
        {/* Upcoming */}
        <FilmSlider
          films={await getFilms({
            endpoint: "/discover/movie",
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
            endpoint: "/discover/movie",
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
            film={await getTrending({ num: 6, type: `movie` })}
            genres={genres}
          />
        </section>
  
        {/* Companies */}
        {companies.slice(0, 3).map(async (company) => (
          <FilmSlider
            key={company.id}
            films={await getFilms({
              endpoint: "/discover/movie",
              params: params({
                apiCompanies: company.id,
              }),
            })}
            title={company.name}
            genres={genres}
          />
        ))}
  
        {/* Trending */}
        <section id="Trending" className="py-[2rem]">
          <Trending
            film={await getTrending({ num: 7, type: `movie` })}
            genres={genres}
          />
        </section>
  
        {/* Genres */}
        {genres.slice(0, 3).map(async (genre) => (
          <FilmSlider
            key={genre.id}
            films={await getFilms({
              endpoint: "/discover/movie",
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
            film={await getTrending({ num: 8, type: `movie` })}
            genres={genres}
          />
        </section>
      </div>
    </>
  );
}

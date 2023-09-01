export const revalidate = 3600; // revalidate this page every 1 hour

import axios from "axios";
import React from "react";
import HomeSlider from "../components/HomeSlider";
import FilmSlider from "../components/FilmSlider";
import Trending from "../components/Trending";
import providers from "../json/providers.json";

export const metadata = {
  title: "TV",
  description: process.env.APP_DESC,
  alternates: {
    canonical: process.env.APP_URL,
  },
  openGraph: {
    title: process.env.APP_NAME,
    description: process.env.APP_DESC,
    url: process.env.APP_URL,
    siteName: process.env.APP_NAME,
    images: "/popcorn.png",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: process.env.APP_NAME,
    description: process.env.APP_DESC,
    creator: "@fachryafrz",
    images: "/popcorn.png",
  },
  icons: {
    icon: "/popcorn.png",
    shortcut: "/popcorn.png",
    apple: "/apple-touch-icon.png",
  },
};

async function getGenres() {
  const res = await axios.get(`${process.env.API_URL}/genre/tv/list`, {
    params: {
      api_key: process.env.API_KEY,
    },
  });

  return res.data.genres;
}

async function getFilms(
  apiUrl,
  date_gte,
  date_lte,
  apiCompanies = "2739|213|49|1024|453",
  apiGenres,
  apiSortBy = "popularity.desc"
) {
  let params = {
    api_key: process.env.API_KEY,
    sort_by: apiSortBy,
    watch_region: "US",
    // with_watch_providers: "8|9|49|337",
    include_adult: false,
    language: "en-US",
    "first_air_date.gte": date_gte,
    "first_air_date.lte": date_lte,
    with_networks: apiCompanies,
    with_genres: apiGenres,
    include_null_first_air_dates: false,
  };

  const res = await axios.get(`${process.env.API_URL}${apiUrl}`, {
    params: {
      ...params,
    },
  });

  return res.data;
}

async function getTrending(num) {
  const res = await axios.get(`${process.env.API_URL}/trending/tv/day`, {
    params: {
      api_key: process.env.API_KEY,
    },
  });

  if (num) {
    return res.data.results[num - 1];
  } else {
    return res.data;
  }
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
  const genres = await getGenres();

  return (
    <>
      <h1 className="sr-only">{`Popcorn Vision (TV)`}</h1>
      <HomeSlider films={await getTrending()} genres={genres} />

      {/* On The Air */}
      <section id="On The Air">
        <FilmSlider
          films={await getFilms("/discover/tv", thirtyDaysAgo, today)}
          title={`On The Air`}
          genres={genres}
        />
      </section>

      {/* Upcoming */}
      <section id="Upcoming">
        <FilmSlider
          films={await getFilms("/discover/tv", tomorrow, endOfYear)}
          title={`Upcoming`}
          genres={genres}
          sort={"ASC"}
        />
      </section>

      {/* Top Rated */}
      <section id="Top Rated">
        <FilmSlider
          films={await getFilms(
            "/discover/tv",
            null,
            null,
            null,
            null,
            "vote_count.desc"
          )}
          title={`Top Rated`}
          genres={genres}
        />
      </section>

      {/* Trending */}
      <section id="Trending" className="py-[2rem]">
        <Trending film={await getTrending(6)} genres={genres} />
      </section>

      {/* Providers */}
      {providers.map(async (provider) => (
        <section key={provider.id} id={provider.name}>
          <FilmSlider
            films={await getFilms("/discover/tv", null, null, provider.id)}
            title={provider.name}
            genres={genres}
          />
        </section>
      ))}

      {/* Trending */}
      <section id="Trending" className="py-[2rem]">
        <Trending film={await getTrending(7)} genres={genres} />
      </section>

      {/* Genres */}
      {genres.map(async (genre) => (
        <section key={genre.id} id={genre.name}>
          <FilmSlider
            films={await getFilms("/discover/tv", null, null, null, genre.id)}
            title={genre.name}
            genres={genres}
          />
        </section>
      ))}
    </>
  );
}

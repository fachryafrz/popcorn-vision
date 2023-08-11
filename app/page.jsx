export const revalidate = 3600; // revalidate this page every 60 seconds

import axios from "axios";
import React from "react";
import HomeSlider from "./components/HomeSlider";
import FilmSlider from "./components/FilmSlider";
import Trending from "./components/Trending";

export const metadata = {
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
  const res = await axios.get(`${process.env.API_URL}/genre/movie/list`, {
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
  apiCompanies,
  apiGenres,
  apiSortBy = "popularity.desc"
) {
  let params = {
    api_key: process.env.API_KEY,
    sort_by: apiSortBy,
    region: "US",
    include_adult: false,
    language: "en-US",
    with_companies: apiCompanies,
    with_genres: apiGenres,
    "primary_release_date.gte": date_gte,
    "primary_release_date.lte": date_lte,
  };

  const res = await axios.get(`${process.env.API_URL}${apiUrl}`, {
    params: {
      ...params,
    },
  });

  return res.data;
}

async function getTrending(num) {
  const res = await axios.get(`${process.env.API_URL}/trending/movie/week`, {
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
  const genres = await getGenres();

  return (
    <>
      <h1 className="sr-only">{`Popcorn Vision`}</h1>
      <HomeSlider films={await getTrending()} genres={genres} />

      <section name="Now Playing">
        <FilmSlider
          films={await getFilms("/discover/movie", thirtyDaysAgo, today)}
          title={`Now Playing`}
          genres={genres}
        />
      </section>

      <section name="Upcoming">
        <FilmSlider
          films={await getFilms("/discover/movie", tomorrow, endOfYear)}
          title={`Upcoming`}
          genres={genres}
          sort={"ASC"}
        />
      </section>

      <section name="Top Rated">
        <FilmSlider
          films={await getFilms(
            "/discover/movie",
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

      <section name="Trending" className="py-[2rem]">
        <Trending film={await getTrending(6)} genres={genres} />
      </section>

      <section name="Marvel Studios">
        <FilmSlider
          films={await getFilms("/discover/movie", null, null, "420")}
          title={`Marvel Studios`}
          genres={genres}
        />
      </section>

      <section name="DC Comics">
        <FilmSlider
          films={await getFilms("/discover/movie", null, null, "429")}
          title={`DC Comics`}
          genres={genres}
        />
      </section>

      <section name="Walt Disney">
        <FilmSlider
          films={await getFilms("/discover/movie", null, null, "2")}
          title={`Walt Disney`}
          genres={genres}
        />
      </section>

      <section name="Universal Pictures">
        <FilmSlider
          films={await getFilms("/discover/movie", null, null, "33")}
          title={`Universal Pictures`}
          genres={genres}
        />
      </section>

      <section name="Paramount">
        <FilmSlider
          films={await getFilms("/discover/movie", null, null, "4")}
          title={`Paramount`}
          genres={genres}
        />
      </section>

      <section name="20th Century Studios">
        <FilmSlider
          films={await getFilms("/discover/movie", null, null, "25")}
          title={`20th Century Studios`}
          genres={genres}
        />
      </section>

      <section name="Pixar Animation">
        <FilmSlider
          films={await getFilms("/discover/movie", null, null, "3")}
          title={`Pixar Animation`}
          genres={genres}
        />
      </section>

      <section name="Trending" className="py-[2rem]">
        <Trending film={await getTrending(7)} genres={genres} />
      </section>

      <section name="Action">
        <FilmSlider
          films={await getFilms("/discover/movie", null, null, null, "28")}
          title={`Action`}
          genres={genres}
        />
      </section>

      <section name="Drama">
        <FilmSlider
          films={await getFilms("/discover/movie", null, null, null, "18")}
          title={`Drama`}
          genres={genres}
        />
      </section>

      <section name="Comedy">
        <FilmSlider
          films={await getFilms("/discover/movie", null, null, null, "35")}
          title={`Comedy`}
          genres={genres}
        />
      </section>

      <section name="Mystery">
        <FilmSlider
          films={await getFilms("/discover/movie", null, null, null, "9648")}
          title={`Mystery`}
          genres={genres}
        />
      </section>

      <section name="Romance">
        <FilmSlider
          films={await getFilms("/discover/movie", null, null, null, "10749")}
          title={`Romance`}
          genres={genres}
        />
      </section>

      <section name="Horror">
        <FilmSlider
          films={await getFilms("/discover/movie", null, null, null, "27")}
          title={`Horror`}
          genres={genres}
        />
      </section>

      <section name="Science Fiction">
        <FilmSlider
          films={await getFilms("/discover/movie", null, null, null, "878")}
          title={`Science Fiction`}
          genres={genres}
        />
      </section>
    </>
  );
}

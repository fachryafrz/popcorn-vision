import axios from "axios";
import React from "react";
import HomeSlider from "./components/HomeSlider";
import FilmSlider from "./components/FilmSlider";
import logo from "./popcorn.png";
import Trending from "./components/Trending";
import Head from "next/head";

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
    api_key: "84aa2a7d5e4394ded7195035a4745dbd",
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

  return res.data.results[num - 1];
}

export default async function HomeMovies() {
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
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Favicon  */}
        {/* <link rel="icon" href="/favicon.ico" type="image/x-icon" /> */}
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />

        {/* Apple Touch Icon (untuk perangkat iOS)  */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Icon untuk Safari Pinned Tab (untuk Safari)  */}
        <link rel="mask-icon" href="/mask-icon.svg" color="blue" />

        {/* Icon untuk browser Android  */}
        <link rel="manifest" href="/manifest.json" />

        <meta name="theme-color" content="#202735" />

        {/* Meta tags */}
        <meta name="robots" content="index, archive" />
        <meta name="title" content={`Popcorn Vision`} />
        <meta name="description" content={process.env.APP_DESC} />
        <meta name="keywords" content={process.env.APP_KEYWORDS} />
        <link rel="canonical" href={process.env.APP_URL} />

        {/* Page title */}
        <title>Popcorn Vision</title>

        {/* Open Graph tags */}
        <meta property="og:site_name" content={`Popcorn Vision`} />
        <meta property="og:title" content={`Popcorn Vision`} />
        <meta property="og:description" content={process.env.APP_DESC} />
        <meta property="og:image" content={`/popcorn.png`} />
        <meta property="og:image:alt" content={`Popcorn Vision`} />
        <meta property="og:url" content={process.env.APP_URL} />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Popcorn Vision`} />
        <meta name="twitter:description" content={process.env.APP_DESC} />
        <meta property="twitter:url" content={process.env.APP_URL} />
        <meta name="twitter:image" content={`/popcorn.png`} />
        <meta name="twitter:image:alt" content={`Popcorn Vision`} />
      </head>

      <h1 className="sr-only">{`Popcorn Vision`}</h1>
      <HomeSlider films={await getFilms("/discover/movie", thirtyDaysAgo)} />
      <section id="NowPlaying">
        <FilmSlider
          films={await getFilms("/discover/movie", thirtyDaysAgo, today)}
          title={`Now Playing`}
          genres={genres}
        />
      </section>
      <section id="Upcoming">
        <FilmSlider
          films={await getFilms("/discover/movie", today, endOfYear)}
          title={`Upcoming`}
          genres={genres}
        />
      </section>
      <section id="TopRated">
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
      <section id="Trending" className="py-[2rem]">
        <Trending film={await getTrending(1)} />
      </section>
      <section id="MarvelStudios">
        <FilmSlider
          films={await getFilms("/discover/movie", null, null, "420")}
          title={`Marvel Studios`}
          genres={genres}
        />
      </section>
      <section id="DCComics">
        <FilmSlider
          films={await getFilms("/discover/movie", null, null, "429")}
          title={`DC Comics`}
          genres={genres}
        />
      </section>
      <section id="WaltDisney">
        <FilmSlider
          films={await getFilms("/discover/movie", null, null, "2")}
          title={`Walt Disney`}
          genres={genres}
        />
      </section>
      <section id="UniversalPictures">
        <FilmSlider
          films={await getFilms("/discover/movie", null, null, "33")}
          title={`Universal Pictures`}
          genres={genres}
        />
      </section>
      <section id="Paramount">
        <FilmSlider
          films={await getFilms("/discover/movie", null, null, "4")}
          title={`Paramount`}
          genres={genres}
        />
      </section>
      <section id="20thCenturyStudios">
        <FilmSlider
          films={await getFilms("/discover/movie", null, null, "25")}
          title={`20th Century Studios`}
          genres={genres}
        />
      </section>
      <section id="PixarAnimation">
        <FilmSlider
          films={await getFilms("/discover/movie", null, null, "3")}
          title={`Pixar Animation`}
          genres={genres}
        />
      </section>
      <section id="Trending" className="py-[2rem]">
        <Trending film={await getTrending(2)} />
      </section>

      <section id="Action">
        <FilmSlider
          films={await getFilms("/discover/movie", null, null, null, "28")}
          title={`Action`}
          genres={genres}
        />
      </section>
      <section id="Drama">
        <FilmSlider
          films={await getFilms("/discover/movie", null, null, null, "18")}
          title={`Drama`}
          genres={genres}
        />
      </section>
      <section id="Comedy">
        <FilmSlider
          films={await getFilms("/discover/movie", null, null, null, "35")}
          title={`Comedy`}
          genres={genres}
        />
      </section>
      <section id="Mystery">
        <FilmSlider
          films={await getFilms("/discover/movie", null, null, null, "9648")}
          title={`Mystery`}
          genres={genres}
        />
      </section>
      <section id="Romance">
        <FilmSlider
          films={await getFilms("/discover/movie", null, null, null, "10749")}
          title={`Romance`}
          genres={genres}
        />
      </section>
      <section id="Horror">
        <FilmSlider
          films={await getFilms("/discover/movie", null, null, null, "27")}
          title={`Horror`}
          genres={genres}
        />
      </section>
      <section id="ScienceFiction">
        <FilmSlider
          films={await getFilms("/discover/movie", null, null, null, "878")}
          title={`Science Fiction`}
          genres={genres}
        />
      </section>
    </>
  );
}

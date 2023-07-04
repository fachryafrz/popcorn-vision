import axios from "axios";
import React from "react";
import HomeSlider from "./components/HomeSlider";
import FilmSlider from "./components/FilmSlider";
import logo from "./popcorn.png";
import Trending from "./components/Trending";

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
  const homeSlider = await getFilms("/discover/movie", thirtyDaysAgo);
  const nowPlaying = await getFilms("/discover/movie", thirtyDaysAgo, today);
  const upcoming = await getFilms("/discover/movie", today, endOfYear);
  const topRated = await getFilms(
    "/discover/movie",
    null,
    null,
    null,
    null,
    "vote_count.desc"
  );
  const trendingFirst = await getTrending(1);
  console.log(trendingFirst);

  return (
    <>
      <h1 className="sr-only">{process.env.APP_NAME}</h1>
      <HomeSlider films={homeSlider} />
      <section id="NowPlaying" className="pt-[2rem]">
        <FilmSlider films={nowPlaying} title={`Now Playing`} genres={genres} />
      </section>
      <section id="Upcoming">
        <FilmSlider films={upcoming} title={`Upcoming`} genres={genres} />
      </section>
      <section id="TopRated">
        <FilmSlider films={topRated} title={`Top Rated`} genres={genres} />
      </section>
      <section id="trending">
        <Trending film={trendingFirst} />
      </section>
    </>
  );
}

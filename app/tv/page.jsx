export const revalidate = 3600; // revalidate this page every 60 seconds

import axios from "axios";
import React from "react";
import HomeSlider from "../components/HomeSlider";
import FilmSlider from "../components/FilmSlider";
import Trending from "../components/Trending";

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
  const res = await axios.get(`${process.env.API_URL}/trending/tv/week`, {
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
      <section name="On The Air">
        <FilmSlider
          films={await getFilms("/discover/tv", thirtyDaysAgo, today)}
          title={`On The Air`}
          genres={genres}
        />
      </section>
      <section name="Upcoming">
        <FilmSlider
          films={await getFilms("/discover/tv", tomorrow, endOfYear)}
          title={`Upcoming`}
          genres={genres}
          sort={"ASC"}
        />
      </section>
      <section name="Top Rated">
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
      <section name="Trending" className="py-[2rem]">
        <Trending film={await getTrending(6)} genres={genres} />
      </section>
      <section name="Disney+">
        <FilmSlider
          films={await getFilms("/discover/tv", null, null, "2739")}
          title={`Disney+`}
          genres={genres}
        />
      </section>
      <section name="Netflix">
        <FilmSlider
          films={await getFilms("/discover/tv", null, null, "213")}
          title={`Netflix`}
          genres={genres}
        />
      </section>
      <section name="HBO">
        <FilmSlider
          films={await getFilms("/discover/tv", null, null, "49")}
          title={`HBO`}
          genres={genres}
        />
      </section>
      <section name="Prime Video">
        <FilmSlider
          films={await getFilms("/discover/tv", null, null, "1024")}
          title={`Prime Video`}
          genres={genres}
        />
      </section>
      <section name="Hulu">
        <FilmSlider
          films={await getFilms("/discover/tv", null, null, "453")}
          title={`Hulu`}
          genres={genres}
        />
      </section>
      <section name="Trending" className="py-[2rem]">
        <Trending film={await getTrending(7)} genres={genres} />
      </section>

      {/* Genres */}
      <section name="Action & Adventure">
        <FilmSlider
          films={await getFilms("/discover/tv", null, null, null, "10759")}
          title={`Action & Adventure`}
          genres={genres}
        />
      </section>
      <section name="Animation">
        <FilmSlider
          films={await getFilms("/discover/tv", null, null, null, "16")}
          title={`Animation`}
          genres={genres}
        />
      </section>
      <section name="Comedy">
        <FilmSlider
          films={await getFilms("/discover/tv", null, null, null, "35")}
          title={`Comedy`}
          genres={genres}
        />
      </section>
      <section name="Crime">
        <FilmSlider
          films={await getFilms("/discover/tv", null, null, null, "80")}
          title={`Crime`}
          genres={genres}
        />
      </section>
      <section name="Documentary">
        <FilmSlider
          films={await getFilms("/discover/tv", null, null, null, "99")}
          title={`Documentary`}
          genres={genres}
        />
      </section>
      <section name="Drama">
        <FilmSlider
          films={await getFilms("/discover/tv", null, null, null, "18")}
          title={`Drama`}
          genres={genres}
        />
      </section>
      <section name="Family">
        <FilmSlider
          films={await getFilms("/discover/tv", null, null, null, "10751")}
          title={`Family`}
          genres={genres}
        />
      </section>
      <section name="Mystery">
        <FilmSlider
          films={await getFilms("/discover/tv", null, null, null, "9648")}
          title={`Mystery`}
          genres={genres}
        />
      </section>
      <section name="Romance">
        <FilmSlider
          films={await getFilms("/discover/tv", null, null, null, "10749")}
          title={`Romance`}
          genres={genres}
        />
      </section>
      <section name="Reality Show">
        <FilmSlider
          films={await getFilms("/discover/tv", null, null, null, "10764")}
          title={`Reality Show`}
          genres={genres}
        />
      </section>
      <section name="Science Fiction">
        <FilmSlider
          films={await getFilms("/discover/tv", null, null, null, "10765")}
          title={`Science Fiction`}
          genres={genres}
        />
      </section>
      <section name="War">
        <FilmSlider
          films={await getFilms("/discover/tv", null, null, null, "10768")}
          title={`War`}
          genres={genres}
        />
      </section>
    </>
  );
}

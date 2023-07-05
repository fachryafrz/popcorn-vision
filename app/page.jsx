import axios from "axios";
import React from "react";
import HomeSlider from "./components/HomeSlider";
import FilmSlider from "./components/FilmSlider";
import Trending from "./components/Trending";

export const metadata = {
  description:
    "Your go-to website for movies and TV shows info. Explore a wide range of titles, with detailed synopses, reviews, cast and crew info. Convenient search functionality makes finding your favorites a breeze. Dive into the world of movies and television with Popcorn Vision.",
  alternates: {
    canonical: "https://www.popcorn.vision",
  },
  openGraph: {
    title: "Popcorn Vision",
    description:
      "Your go-to website for movies and TV shows info. Explore a wide range of titles, with detailed synopses, reviews, cast and crew info. Convenient search functionality makes finding your favorites a breeze. Dive into the world of movies and television with Popcorn Vision.",
    url: "https://www.popcorn.vision",
    siteName: "Popcorn Vision",
    images: "/popcorn.png",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Popcorn Vision",
    description:
      "Your go-to website for movies and TV shows info. Explore a wide range of titles, with detailed synopses, reviews, cast and crew info. Convenient search functionality makes finding your favorites a breeze. Dive into the world of movies and television with Popcorn Vision.",
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

  return res.data.results[num - 1];
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
      <HomeSlider films={await getFilms("/discover/movie", thirtyDaysAgo)} />

      <section id="Now Playing">
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

      <section id="Top Rated">
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

      <section id="Marvel Studios">
        <FilmSlider
          films={await getFilms("/discover/movie", null, null, "420")}
          title={`Marvel Studios`}
          genres={genres}
        />
      </section>

      <section id="DC Comics">
        <FilmSlider
          films={await getFilms("/discover/movie", null, null, "429")}
          title={`DC Comics`}
          genres={genres}
        />
      </section>

      <section id="Walt Disney">
        <FilmSlider
          films={await getFilms("/discover/movie", null, null, "2")}
          title={`Walt Disney`}
          genres={genres}
        />
      </section>

      <section id="Universal Pictures">
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

      <section id="20th Century Studios">
        <FilmSlider
          films={await getFilms("/discover/movie", null, null, "25")}
          title={`20th Century Studios`}
          genres={genres}
        />
      </section>

      <section id="Pixar Animation">
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

      <section id="Science Fiction">
        <FilmSlider
          films={await getFilms("/discover/movie", null, null, null, "878")}
          title={`Science Fiction`}
          genres={genres}
        />
      </section>
    </>
  );
}

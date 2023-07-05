import FilmDetail from "@/app/movies/[id]/page";
import axios from "axios";
import React from "react";

async function getFilm(id, type, path) {
  const res = await axios.get(`${process.env.API_URL}/${type}/${id}${path}`, {
    params: {
      api_key: process.env.API_KEY,
      language: "en",
    },
  });

  return res.data;
}

export async function generateMetadata({ params, type = "tv" }) {
  const { id } = params;
  const film = await getFilm(id, type);

  const isTvPage = type !== "movie" ? true : false;

  const filmReleaseDate = !isTvPage
    ? new Date(film.release_date).getFullYear() // For movies, use the release_date
    : new Date(film.last_air_date).getFullYear() ===
      new Date(film.first_air_date).getFullYear()
    ? new Date(film.first_air_date).getFullYear() // For TV shows with the same first and last air date, use the first_air_date
    : `${new Date(film.first_air_date).getFullYear()}-${new Date(
        film.last_air_date
      ).getFullYear()}`;

  return {
    title: `${film.name} (${filmReleaseDate})`,
    description: film.overview,
    alternates: {
      canonical: `/${`tv`}/${film.id}`,
    },
    openGraph: {
      title: `${film.name} (${filmReleaseDate}) - Popcorn Vision`,
      description: film.overview,
      url: `${process.env.APP_URL}/${`tv`}/${film.id}`,
      siteName: process.env.APP_NAME,
      images: `${process.env.API_IMAGE_500}${film.poster_path}`,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${film.name} (${filmReleaseDate}) - Popcorn Vision`,
      description: film.overview,
      creator: "@fachryafrz",
      images: `${process.env.API_IMAGE_500}${film.poster_path}`,
    },
  };
}

export default function page({ params }) {
  return <FilmDetail params={params} type="tv" />;
}

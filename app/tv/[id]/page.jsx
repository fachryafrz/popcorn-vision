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
  const images = await getFilm(id, type, "/images");

  const isTvPage = type !== "movie" ? true : false;
  const date = new Date(!isTvPage ? film.release_date : film.first_air_date);

  const filmReleaseDate = date.getFullYear();
  const lastAirDate =
    film.last_air_date !== null &&
    new Date(film.last_air_date).getFullYear() !==
      new Date(film.first_air_date).getFullYear();

  let backdrops;

  if (images.backdrops.length > 0) {
    backdrops = {
      images: `${process.env.API_IMAGE_500}${images.backdrops[0].file_path}`,
    };
  } else if (film.backdrop_path) {
    backdrops = {
      images: `${process.env.API_IMAGE_500}${film.backdrop_path}`,
    };
  } else if (film.poster_path) {
    backdrops = {
      images: `${process.env.API_IMAGE_500}${film.poster_path}`,
    };
  }

  return {
    title: `${film.name} (${
      lastAirDate
        ? `${filmReleaseDate}-${new Date(film.last_air_date).getFullYear()}`
        : filmReleaseDate
    })`,
    description: film.overview,
    alternates: {
      canonical: `/${`tv`}/${film.id}`,
    },
    openGraph: {
      title: `${film.name} (${
        lastAirDate
          ? `${filmReleaseDate}-${new Date(film.last_air_date).getFullYear()}`
          : filmReleaseDate
      }) - ${process.env.APP_NAME}`,
      description: film.overview,
      url: `${process.env.APP_URL}/${`tv`}/${film.id}`,
      siteName: process.env.APP_NAME,
      ...backdrops,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${film.name} (${
        lastAirDate
          ? `${filmReleaseDate}-${new Date(film.last_air_date).getFullYear()}`
          : filmReleaseDate
      }) - ${process.env.APP_NAME}`,
      description: film.overview,
      creator: "@fachryafrz",
      ...backdrops,
    },
  };
}

export default function page({ params }) {
  return <FilmDetail params={params} type="tv" />;
}

import { releaseStatus } from "@/lib/releaseStatus";
import React from "react";
import FilmDetail from "../../movies/[id]/page";
import { axios } from "@/lib/axios";

export async function generateMetadata({ params, type = `tv` }) {
  const { id } = params;

  const [film, images] = await Promise.all([
    axios.get(`/${type}/${id}`).then(({ data }) => data),

    axios.get(`/${type}/${id}/images`, {
      params: {
        include_image_language: "en",
      },
    }).then(({ data }) => data),
  ])

  const isTvPage = type !== "movie" ? true : false;
  const date = new Date(!isTvPage ? film.release_date : film.first_air_date);

  const filmReleaseDate = film.first_air_date
    ? date.getFullYear()
    : releaseStatus(film.status);
  const lastAirDate =
    film.last_air_date !== null &&
    new Date(film.last_air_date).getFullYear() !==
    new Date(film.first_air_date).getFullYear();

  let backdrops;

  let path =
    images.backdrops.length > 0
      ? images.backdrops[0].file_path
      : film.backdrop_path || film.poster_path;
  if (path) {
    backdrops = {
      images: `https://image.tmdb.org/t/p/w500${path}`,
    };
  }

  return {
    title: `${film.name} (${lastAirDate
      ? `${filmReleaseDate}-${new Date(film.last_air_date).getFullYear()}`
      : filmReleaseDate
      })`,
    description: film.overview,
    openGraph: {
      title: `${film.name} (${lastAirDate
        ? `${filmReleaseDate}-${new Date(film.last_air_date).getFullYear()}`
        : filmReleaseDate
        }) - ${process.env.NEXT_PUBLIC_APP_NAME}`,
      description: film.overview,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/${`tv`}/${film.id}`,
      siteName: process.env.NEXT_PUBLIC_APP_NAME,
      ...backdrops,
      locale: "en_US",
      type: "website",
    },
  };
}

export default function page({ params }) {
  return <FilmDetail params={params} type={`tv`} />;
}

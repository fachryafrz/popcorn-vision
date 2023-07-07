import axios from "axios";
import React from "react";
import FilmBackdrop from "./components/FilmBackdrop";
import FilmPoster from "./components/FilmPoster";
import FilmOverview from "./components/FilmOverview";
import CastsList from "./components/CastsList";

async function getFilm(id, type, path) {
  const res = await axios.get(`${process.env.API_URL}/${type}/${id}${path}`, {
    params: {
      api_key: process.env.API_KEY,
      language: "en",
    },
  });

  return res.data;
}

export async function generateMetadata({ params, type = "movie" }) {
  const { id } = params;
  const film = await getFilm(id, type);
  const images = await getFilm(id, type, "/images");

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
    title: `${film.title} (${filmReleaseDate})`,
    description: film.overview,
    alternates: {
      canonical: `/${`movies`}/${film.id}`,
    },
    openGraph: {
      title: `${film.title} (${filmReleaseDate}) - Popcorn Vision`,
      description: film.overview,
      url: `${process.env.APP_URL}/${`movies`}/${film.id}`,
      siteName: process.env.APP_NAME,
      images: `${process.env.API_IMAGE_500}${images.backdrops[0].file_path}`,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${film.title} (${filmReleaseDate}) - Popcorn Vision`,
      description: film.overview,
      creator: "@fachryafrz",
      images: `${process.env.API_IMAGE_500}${images.backdrops[0].file_path}`,
    },
  };
}

export default async function FilmDetail({ params, type = "movie" }) {
  const { id } = params;

  const film = await getFilm(id, type);
  const credits = await getFilm(id, type, "/credits");
  const videos = await getFilm(id, type, "/videos");
  const images = await getFilm(id, type, "/images");
  const reviews = await getFilm(id, type, "/reviews");

  return (
    <>
      <div className="flex flex-col bg-base-dark-gray text-white">
        {/* Movie Background/Backdrop */}
        <FilmBackdrop film={film} />
        <div className="z-10 -mt-[10vh] md:-mt-[20vh] lg:-mt-[30vh] xl:-mt-[50vh]">
          <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-24 gap-4 px-4 pb-[2rem] md:pb-[5rem]">
            {/* Left */}
            <div className="lg:col-span-6">
              <FilmPoster film={film} />
            </div>
            {/* Middle */}
            <div className="lg:col-span-13">
              <FilmOverview
                film={film}
                videos={videos}
                images={images}
                reviews={reviews}
                credits={credits}
              />
            </div>
            {/* Right */}
            <div className="lg:col-span-5">
              {credits.cast.length > 0 && <CastsList credits={credits} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

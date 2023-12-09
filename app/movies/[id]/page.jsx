import axios from "axios";
import React from "react";
import FilmBackdrop from "./components/FilmBackdrop";
import FilmPoster from "./components/FilmPoster";
import FilmOverview from "./components/FilmOverview";
import CastsList from "./components/CastsList";
import FilmSlider from "@/app/components/FilmSlider";
import FilmInfo from "./components/FilmInfo";
import FilmContent from "./components/FilmContent";

async function getFilm(id, type, path) {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/${type}/${id}${path}`,
    {
      params: {
        api_key: process.env.NEXT_PUBLIC_API_KEY,
        language: "en",
      },
    }
  );

  return res.data;
}

async function getGenres(type) {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/genre/${type}/list`,
    {
      params: {
        api_key: process.env.NEXT_PUBLIC_API_KEY,
      },
    }
  );

  return res.data.genres;
}

export async function generateMetadata({ params, type = "movie" }) {
  const { id } = params;
  const film = await getFilm(id, type);
  const images = await getFilm(id, type, "/images");

  const isTvPage = type !== "movie" ? true : false;

  const filmReleaseDate = film.release_date
    ? new Date(film.release_date).getFullYear()
    : `Coming soon`;

  let backdrops;

  // if (images.backdrops.length > 0) {
  //   backdrops = {
  //     images: `${process.env.NEXT_PUBLIC_API_IMAGE_500}${images.backdrops[0].file_path}`,
  //   };
  // } else if (film.backdrop_path) {
  //   backdrops = {
  //     images: `${process.env.NEXT_PUBLIC_API_IMAGE_500}${film.backdrop_path}`,
  //   };
  // } else if (film.poster_path) {
  //   backdrops = {
  //     images: `${process.env.NEXT_PUBLIC_API_IMAGE_500}${film.poster_path}`,
  //   };
  // }

  let path =
    images.backdrops.length > 0
      ? images.backdrops[0].file_path
      : film.backdrop_path || film.poster_path;
  if (path) {
    backdrops = {
      images: `${process.env.NEXT_PUBLIC_API_IMAGE_500}${path}`,
    };
  }

  return {
    title: `${film.title} (${filmReleaseDate})`,
    description: film.overview,
    alternates: {
      canonical: `/${`movies`}/${film.id}`,
    },
    openGraph: {
      title: `${film.title} (${filmReleaseDate}) - Popcorn Vision`,
      description: film.overview,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/${`movies`}/${film.id}`,
      siteName: process.env.NEXT_PUBLIC_APP_NAME,
      ...backdrops,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${film.title} (${filmReleaseDate}) - Popcorn Vision`,
      description: film.overview,
      creator: "@fachryafrz",
      ...backdrops,
    },
  };
}

export default async function FilmDetail({ params, type = "movie" }) {
  const { id } = params;

  const isTvPage = type !== "movie" ? true : false;

  const film = await getFilm(id, type);
  const credits = await getFilm(id, type, "/credits");
  const videos = await getFilm(id, type, "/videos");
  const images = await getFilm(id, type, "/images");
  const reviews = await getFilm(id, type, "/reviews");
  const providers = await getFilm(id, type, "/watch/providers");
  const recommendations = await getFilm(id, type, "/recommendations");
  const similar = await getFilm(id, type, "/similar");

  // This can cause double data from recommendation & similar
  // which means there can be two same movies in the list
  let recommendationsAndSimilar = {
    results: [...recommendations.results, ...similar.results],
  };

  const genres = await getGenres(type);

  return (
    <div
      className={`flex flex-col bg-base-100 text-white pb-[2rem] md:pb-[5rem] relative`}
    >
      {/* Movie Background/Backdrop */}
      <FilmBackdrop film={film} />

      {/* Film Contents */}
      <FilmContent
        film={film}
        videos={videos}
        images={images}
        reviews={reviews}
        credits={credits}
        providers={providers}
        isTvPage={isTvPage}
      />

      {/* Recommendations */}
      {recommendations.results.length > 0 && (
        <FilmSlider
          films={recommendations}
          title={
            recommendations.results.length > 1
              ? `Recommendations`
              : `Recommendation`
          }
          genres={genres}
        />
      )}
    </div>
  );
}

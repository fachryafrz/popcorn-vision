/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import React from "react";

export default function FilmCard({ film, genres, isTvPage }) {
  const releaseDate = !isTvPage ? film.release_date : film.first_air_date;
  const date = new Date(releaseDate);
  const options = { year: "numeric", month: "short" };
  const formattedDate = date.toLocaleString("en-US", options);

  const isItTvPage = (movie, tv) => {
    const type = !isTvPage ? movie : tv;
    return type;
  };

  function slugify(text) {
    return (
      text &&
      text
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "")
    );
  }

  return (
    <Link
      href={isItTvPage(
        `/movies/${film.id}-${slugify(film.title)}`,
        `/tv/${film.id}-${slugify(film.name)}`
      )}
    >
      <figure className="rounded-lg overflow-hidden aspect-poster relative">
        <div
          className={
            film.poster_path === null
              ? `w-full h-full bg-base-dark-gray grid place-items-center`
              : `hidden`
          }
        >
          <img
            loading="lazy"
            src={`/popcorn.png`}
            alt={isItTvPage(film.title, film.name)}
            className="w-fit h-fit"
          />
        </div>

        <img
          loading="lazy"
          src={`https://image.tmdb.org/t/p/w300${film.poster_path}`}
          alt={isItTvPage(film.title, film.name)}
        />

        {film.vote_average > 0 && (
          <div
            className={`absolute top-0 left-0 text-xs font-semibold aspect-square grid place-items-center rounded-full border-2 w-9 m-2 bg-base-dark-gray bg-opacity-50 backdrop-blur-sm ${
              film.vote_average >= 1 && film.vote_average <= 3
                ? `border-primary-red`
                : film.vote_average >= 4 && film.vote_average <= 7
                ? `border-primary-yellow`
                : `border-green-500`
            }`}
          >
            {film.vote_average < 9.9
              ? film.vote_average.toFixed(1)
              : film.vote_average}
          </div>
        )}
      </figure>
      <div className="mt-2">
        <h3
          title={isItTvPage(film.title, film.name)}
          className="font-bold text-sm sm:text-lg line-clamp-1"
        >
          {isItTvPage(film.title, film.name)}
        </h3>

        <div className="flex items-center gap-1 text-xs sm:text-sm mt-1">
          <span className="text-gray-400 whitespace-nowrap">
            {releaseDate !== "" ? formattedDate : `Coming soon`}
          </span>

          {formattedDate !== "NaN" && genres.length > 0 && (
            <span className="text-gray-400 whitespace-nowrap">&bull;</span>
          )}

          <p className="line-clamp-1">
            {genres && genres.map((genre) => genre && genre.name).join(", ")}
          </p>
        </div>
      </div>
    </Link>
  );
}

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { slugify } from "../lib/slugify";
import { formatDate } from "../lib/formatDate";
import ImagePovi from "./ImagePovi";

export default function FilmCard({ film, genres, isTvPage }) {
  const releaseDate = !isTvPage ? film.release_date : film.first_air_date;
  const options = { year: "numeric", month: "short" };

  const isItTvPage = (movie, tv) => {
    const type = !isTvPage ? movie : tv;
    return type;
  };

  return (
    <Link
      href={isItTvPage(
        `/movies/${film.id}-${slugify(film.title)}`,
        `/tv/${film.id}-${slugify(film.name)}`
      )}
    >
      <ImagePovi
        imgPath={
          film.poster_path &&
          `https://image.tmdb.org/t/p/w300${film.poster_path}`
        }
        className={`rounded-xl overflow-hidden aspect-poster relative`}
      >
        {film.vote_average > 0 && (
          <div
            className={`absolute top-0 left-0 m-2 p-1 bg-base-100 bg-opacity-50 backdrop-blur-sm rounded-full`}
          >
            <div
              className={`radial-progress text-sm font-semibold ${
                film.vote_average > 0 && film.vote_average < 3
                  ? `text-primary-red`
                  : film.vote_average >= 3 && film.vote_average < 7
                  ? `text-primary-yellow`
                  : `text-green-500`
              }`}
              style={{
                "--value": film.vote_average * 10,
                "--size": "30px",
                "--thickness": "3px",
              }}
            >
              <span className={`text-white text-xs`}>
                {film.vote_average < 9.9
                  ? film.vote_average.toFixed(1)
                  : film.vote_average}
              </span>
            </div>
          </div>
        )}
      </ImagePovi>
      <div className="mt-2">
        <h3
          title={isItTvPage(film.title, film.name)}
          className="font-bold text-sm sm:text-base line-clamp-1"
        >
          {isItTvPage(film.title, film.name)}
        </h3>

        <div className="flex items-center gap-1 text-xs sm:text-sm mt-1">
          <span className="text-gray-400 whitespace-nowrap">
            {formatDate({
              date: releaseDate,
              showDay: false,
              options,
            })}
          </span>

          {releaseDate !== null && genres.length > 0 && (
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

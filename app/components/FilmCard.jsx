/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import React from "react";

export default function FilmCard({ film, genres }) {
  return (
    <Link href={`/movies/${film.id}`} className={`flex flex-col`}>
      <figure className="rounded-lg overflow-hidden aspect-poster">
        <img
          src={`https://image.tmdb.org/t/p/w500${film.poster_path}`}
          alt={film.title}
        />
      </figure>
      <h3 className="mt-2 font-bold text-sm sm:text-lg line-clamp-1">
        {film.title}
      </h3>
      <div className="flex items-center gap-1 text-gray-400">
        <span>{new Date(film.release_date).getFullYear()}</span>
        <span>&bull;</span>
        <span className="text-white line-clamp-1">
          {genres.map((genre) => genre.name).join(", ")}
        </span>
      </div>
    </Link>
  );
}

import React from "react";
import { Link } from "react-router-dom";

export function FilmCard({ movie, logo, movieGenres }) {
  return (
    <Link to={`/movies/${movie.id}`}>
      <figure className="rounded-lg overflow-hidden aspect-poster">
        <div
          className={
            movie.poster_path === null
              ? `w-full h-full bg-base-dark-gray grid place-items-center`
              : `hidden`
          }
        >
          <img src={logo} alt={movie.title} className="w-fit h-fit" />
        </div>
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
        />
      </figure>
      <div className="mt-2">
        <h3 title={movie.title} className="font-bold text-lg line-clamp-1">
          {movie.title}
        </h3>
        <div className="whitespace-nowrap flex items-center gap-1">
          <span className="text-gray-400 whitespace-nowrap">
            {new Date(movie.release_date).getFullYear()} &bull;
          </span>
          {movieGenres &&
            movieGenres.map(
              (genre, index) =>
                genre &&
                genre.name && (
                  <span
                    key={index}
                    className="py-0.5 px-2 bg-base-gray bg-opacity-40 rounded-lg text-gray-200 border border-base-gray text-sm"
                  >
                    {genre.name}
                  </span>
                )
            )}
        </div>
      </div>
    </Link>
  );
}

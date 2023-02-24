import React from "react";
import { Link } from "react-router-dom";
import { Loading } from "./Loading";

export function FilmCard({ movie, logo, movieGenres, isTvPage, loading }) {
  return (
    <Link to={!isTvPage ? `/movies/${movie.id}` : `/tv/${movie.id}`}>
      <figure className="rounded-lg overflow-hidden aspect-poster">
        <div
          className={
            movie.poster_path === null
              ? `w-full h-full bg-base-dark-gray grid place-items-center`
              : `hidden`
          }
        >
          <img
            src={logo}
            alt={!isTvPage ? movie.title : movie.name}
            className="w-fit h-fit"
          />
        </div>
        {loading ? (
          <Loading />
        ) : (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={!isTvPage ? movie.title : movie.name}
          />
        )}
      </figure>
      <div className="mt-2">
        {loading ? (
          <Loading height="[20px]" />
        ) : (
          <h3
            title={!isTvPage ? movie.title : movie.name}
            className="font-bold text-lg line-clamp-1"
          >
            {!isTvPage ? movie.title : movie.name}
          </h3>
        )}
        {loading ? (
          <Loading height="[10px] mt-1" />
        ) : (
          <div className="whitespace-nowrap flex items-center gap-1">
            <span className="text-gray-400 whitespace-nowrap">
              {new Date(
                !isTvPage ? movie.release_date : movie.first_air_date
              ).getFullYear()}{" "}
              &bull;
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
        )}
      </div>
    </Link>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import { Loading } from "./Loading";

export function FilmCard({ movie, logo, movieGenres, isTvPage, loading }) {
  const releaseDate = !isTvPage ? movie.release_date : movie.first_air_date;
  const year = new Date(releaseDate + "Z").getFullYear();

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
          {loading ? (
            <Loading classNames={`aspect-poster`} />
          ) : (
            <img
              loading="lazy"
              src={logo}
              alt={!isTvPage ? movie.title : movie.name}
              className="w-fit h-fit"
            />
          )}
        </div>
        {loading ? (
          <Loading classNames={`aspect-poster`} />
        ) : (
          <img
            loading="lazy"
            src={`${import.meta.env.VITE_API_IMAGE_URL_500}${
              movie.poster_path
            }`}
            alt={!isTvPage ? movie.title : movie.name}
          />
        )}
      </figure>
      <div className="mt-2">
        {loading ? (
          <Loading classNames={`!h-[20px]`} />
        ) : (
          <h3
            title={!isTvPage ? movie.title : movie.name}
            className="font-bold text-sm sm:text-lg line-clamp-1"
          >
            {!isTvPage ? movie.title : movie.name}
          </h3>
        )}

        <div className="flex items-center gap-1 text-xs sm:text-sm mt-1">
          {loading ? (
            <Loading classNames={`!h-[10px] !w-[75px]`} />
          ) : (
            <span className="text-gray-400 whitespace-nowrap">
              {releaseDate !== "" ? year : `Coming soon`}
            </span>
          )}
          {!loading && year !== "NaN" && movieGenres.length > 0 && (
            <span className="text-gray-400 whitespace-nowrap">&bull;</span>
          )}
          {/* {movieGenres &&
              movieGenres.map(
                (genre, index) =>
                  genre &&
                  genre.name && (
                    <span
                      key={index}
                      className="py-0.5 px-2 bg-base-gray bg-opacity-40 rounded-lg text-gray-200 border border-base-gray"
                    >
                      {genre.name}
                    </span>
                  )
              )} */}
          {loading ? (
            <Loading classNames={`!h-[10px]`} />
          ) : (
            <p className="line-clamp-1">
              {movieGenres &&
                movieGenres.map((item) => item && item.name).join(", ")}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

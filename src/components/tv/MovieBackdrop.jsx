import React from "react";

export function MovieBackdrop({ logo, movie }) {
  return (
    <figure className="max-h-[70vh] overflow-hidden z-0 relative before:absolute before:inset-0 before:bg-gradient-to-t before:from-base-dark-gray before:z-0 aspect-video">
      <div
        className={
          movie.backdrop_path === null
            ? `w-full h-full bg-base-dark-gray flex justify-center`
            : `hidden`
        }
      >
        <img
          src={logo}
          alt="Popcorn Prespective"
          className="object-none w-fit h-fit"
        />
      </div>
      <img
        src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
        alt={movie.title}
        className="object-top"
      />
    </figure>
  );
}

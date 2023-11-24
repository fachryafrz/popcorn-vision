/* eslint-disable @next/next/no-img-element */
import React from "react";

export default function FilmBackdrop({ film }) {
  return (
    <figure className="max-h-[100vh] overflow-hidden z-0 absolute inset-0 w-full before:absolute before:inset-0 before:bg-gradient-to-t before:from-base-100 before:z-0 aspect-video md:opacity-[60%] lg:max-h-[80dvh]">
      <div
        className={
          film.backdrop_path === null
            ? `w-full h-full bg-base-100 flex justify-center`
            : `hidden`
        }
      >
        <img
          loading="lazy"
          src={`/popcorn.png`}
          alt={process.env.APP_NAME}
          className="object-contain"
        />
      </div>

      <img
        loading="lazy"
        src={`https://image.tmdb.org/t/p/w1280${film.backdrop_path}`}
        alt={film.title}
        style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/w300${film.backdrop_path})`,
          }}
        className="object-top"
      />
    </figure>
  );
}

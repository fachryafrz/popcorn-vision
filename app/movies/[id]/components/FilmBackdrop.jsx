/* eslint-disable @next/next/no-img-element */
import React from "react";

export default function FilmBackdrop({ film }) {
  return (
    <figure className="max-h-[100vh] overflow-hidden z-0 relative before:absolute before:inset-0 before:bg-gradient-to-t before:from-base-dark-gray before:z-0 aspect-video md:opacity-[60%] lg:max-h-[80vh]">
      <div
        className={
          film.backdrop_path === null
            ? `w-full h-full bg-base-dark-gray flex justify-center`
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
        src={`${process.env.API_IMAGE_1280}${film.backdrop_path}`}
        alt={film.title}
        className="object-top"
      />
    </figure>
  );
}

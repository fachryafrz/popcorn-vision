/* eslint-disable @next/next/no-img-element */
import React from "react";

export default function FilmBackdrop({ film }) {
  let popcorn = `url(/popcorn.png)`;
  let filmBackdrop = `url(https://image.tmdb.org/t/p/w1280${film.backdrop_path})`;

  return (
    <figure
      className={`max-h-[100dvh] overflow-hidden z-0 absolute inset-0 w-full before:absolute before:inset-0 before:bg-gradient-to-t before:from-base-100 before:z-0 aspect-video md:opacity-[60%] lg:max-h-[80dvh]`}
      style={{
        backgroundImage: film.backdrop_path === null ? popcorn : filmBackdrop,
        backgroundSize: film.backdrop_path === null ? `contain` : `cover` ,
        backgroundRepeat: `no-repeat`,
        backgroundPosition: `top`,
      }}
    ></figure>
  );
}

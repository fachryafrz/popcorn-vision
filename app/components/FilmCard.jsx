/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React from "react";

export default function FilmCard({ film }) {
  return (
    <article>
      <Link href={`/movie/${film.id}`}>
        <figure>
          <img
            src={`${process.env.API_IMAGE_500}${film.poster_path}`}
            alt={film.title}
          />
        </figure>
        <h2>{film.title}</h2>
      </Link>
    </article>
  );
}

/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import React from "react";

export default async function MovieDetail({ params }) {
  const { id } = params;

  let film;

  try {
    const res = await axios.get(`${process.env.API_URL}/movie/${id}`, {
      params: {
        api_key: process.env.API_KEY,
      },
    });
    film = await res.data;
  } catch (error) {
    console.log(`Error:`, error);
  }

  return (
    <>
      <h1>{film.title}</h1>
      <figure>
        <img
          src={`${process.env.API_IMAGE_1280}${film.backdrop_path}`}
          alt={film.title}
        />
      </figure>
    </>
  );
}

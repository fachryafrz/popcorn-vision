/* eslint-disable @next/next/no-img-element */

import axios from "axios";
import React from "react";

async function getData({ film }) {
  const res = await axios.get(
    `https://api.themoviedb.org/3/movie/${film.id}/images`,
    {
      params: {
        api_key: "84aa2a7d5e4394ded7195035a4745dbd",
        language: "en",
      },
    }
  );
}

export default async function TitleLogo({ film }) {
  // Add function
  // Add function

  return (
    <figure className="mb-4 flex justify-center">
      <img
        src={`${process.env.API_IMAGE_500}${titleLogo.file_path}`}
        alt={film.title}
        className="max-h-[150px] lg:max-h-[200px]"
      />
    </figure>
  );
}

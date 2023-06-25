import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";

export default function MovieTitleLogo({ movie, isTvPage }) {
  const [movieTitleLogo, setMovieTitleLogo] = useState([]);

  useEffect(() => {
    const fetchLogos = async () => {
      axios
        .get(
          `${import.meta.env.VITE_API_BASE_URL}/${
            !isTvPage ? `movie` : `tv`
          }/${movie}/images`,
          {
            params: {
              api_key: "84aa2a7d5e4394ded7195035a4745dbd",
              language: "en",
            },
          }
        )
        .then((response) => {
          setMovieTitleLogo(response.data.logos[0]);
        });
    };

    fetchLogos();
  }, [movie]);

  return (
    <figure className="mb-4 w-full flex justify-center sm:max-w-fit">
      <img
        src={`${import.meta.env.VITE_API_IMAGE_URL_500}${
          movieTitleLogo && movieTitleLogo.file_path
        }`}
        alt={!isTvPage ? movie && movie.title : movie && movie.name}
        className="max-w-full max-h-[150px] object-contain"
      />
    </figure>
  );
}

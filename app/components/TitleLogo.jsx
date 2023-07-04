/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TitleLogo({ film }) {
  const [titleLogo, setTitleLogo] = useState({});

  useEffect(() => {
    const fetchTitleLogo = async () => {
      axios
        .get(`https://api.themoviedb.org/3/movie/${film}/images`, {
          params: {
            api_key: "84aa2a7d5e4394ded7195035a4745dbd",
            language: "en",
          },
        })
        .then((response) => {
          setTitleLogo(response.data.logos[0]);
        });
    };

    fetchTitleLogo();
  }, [film]);

  return (
    <figure className="mb-4 flex justify-center">
      <img
        src={`https://image.tmdb.org/t/p/w500${titleLogo.file_path}`}
        alt={film.title}
        className="max-h-[150px]"
      />
    </figure>
  );
}

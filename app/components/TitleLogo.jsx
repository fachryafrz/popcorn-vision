/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { usePathname } from "next/navigation";

export default function TitleLogo({ film }) {
  const [titleLogo, setTitleLogo] = useState({});
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");

  useEffect(() => {
    const fetchTitleLogo = async () => {
      axios
        .get(
          `https://api.themoviedb.org/3/${!isTvPage ? `movie` : `tv`}/${
            film.id
          }/images`,
          {
            params: {
              api_key: "84aa2a7d5e4394ded7195035a4745dbd",
              language: "en",
            },
          }
        )
        .then((response) => {
          setTitleLogo(response.data.logos[0]);
          setLoading(false);
        });
    };

    fetchTitleLogo();
  }, [film, isTvPage]);

  return titleLogo ? (
    <>
      {!loading ? (
        <figure className="mb-4 flex justify-center">
          <img
            src={`https://image.tmdb.org/t/p/w500${titleLogo.file_path}`}
            alt={!isTvPage ? film.title : film.name}
            title={!isTvPage ? film.title : film.name}
            className="max-h-[150px]"
          />
          <figcaption>
            <h3 className={`sr-only`}>{!isTvPage ? film.title : film.name}</h3>
          </figcaption>
        </figure>
      ) : (
        <div
          className={`h-[100px] w-[300px] animate-pulse bg-gray-400 bg-opacity-50 rounded-lg`}
        ></div>
      )}
    </>
  ) : (
    <h3 className="font-bold text-4xl lg:text-5xl line-clamp-1 lg:line-clamp-2 !leading-tight">
      {!isTvPage ? film.title : film.name}
    </h3>
  );
}

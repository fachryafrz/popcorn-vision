/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function TitleLogo({ film }) {
  const [titleLogo, setTitleLogo] = useState({});

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
        });
    };

    fetchTitleLogo();
  }, [film, isTvPage]);

  return (
    <>
      {titleLogo ? (
        <figure className="mb-4 flex justify-center">
          <Image
            src={`https://image.tmdb.org/t/p/w500${titleLogo.file_path}`}
            alt={!isTvPage ? film.title : film.name}
            title={!isTvPage ? film.title : film.name}
            className="max-w-[300px] lg:max-w-none lg:max-h-[150px]"
            width={1000}
            height={1000}
          />
          <figcaption>
            <h3 className={`sr-only`}>{!isTvPage ? film.title : film.name}</h3>
          </figcaption>
        </figure>
      ) : (
        <h3 className="font-bold text-2xl lg:text-5xl line-clamp-1 lg:line-clamp-2 !leading-tight">
          {!isTvPage ? film.title : film.name}
        </h3>
      )}
    </>
  );
}

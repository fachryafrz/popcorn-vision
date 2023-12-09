/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { usePathname } from "next/navigation";

export default function TitleLogo({ film, images }) {
  const [titleLogo, setTitleLogo] = useState({});
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");
  const isDetailPage = pathname.startsWith("/movies") || isTvPage;
  const title = !isTvPage ? film.title : film.name;

  useEffect(() => {
    const fetchTitleLogo = async () => {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/${!isTvPage ? `movie` : `tv`}/${
            film.id
          }/images`,
          {
            params: {
              api_key: process.env.NEXT_PUBLIC_API_KEY,
              language: "en",
            },
          }
        )
        .then((response) => {
          setTitleLogo(response.data.logos[0]);
          setLoading(false);
        });
    };

    if (images) {
      setLoading(false);
      setTitleLogo(images.logos[0]);
    } else {
      fetchTitleLogo();
    }
  }, [film, isTvPage, images]);

  return titleLogo ? (
    <figure className="mb-4 flex justify-center">
      {!loading ? (
        <img
          src={`https://image.tmdb.org/t/p/w500${titleLogo.file_path}`}
          alt={title}
          title={title}
          className="max-h-[150px] object-contain pointer-events-none"
        />
      ) : (
        <div className="h-[150px] w-full max-w-[350px] animate-pulse bg-gray-400 bg-opacity-20 rounded-lg"></div>
      )}
      {!images && (
        <figcaption className="sr-only">
          <h3 style={{ textWrap: `balance` }}>{title}</h3>
        </figcaption>
      )}
    </figure>
  ) : (
    <h3 className="font-bold text-4xl lg:text-5xl line-clamp-1 lg:line-clamp-2 leading-tight">
      {title}
    </h3>
  );
}

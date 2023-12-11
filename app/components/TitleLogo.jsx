/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getTitleLogo } from "../api/route";

export default function TitleLogo({ film, images }) {
  const [titleLogo, setTitleLogo] = useState({});
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");
  const isDetailPage = pathname.startsWith("/movies") || isTvPage;
  const title = !isTvPage ? film.title : film.name;

  useEffect(() => {
    getTitleLogo({ film, isTvPage }).then((res) => {
      setTitleLogo(res);
      setLoading(false);
    });
  }, [film, isTvPage]);

  return !loading ? (
    titleLogo ? (
      <figure className="mb-4 flex justify-center">
        <img
          src={`https://image.tmdb.org/t/p/w500${titleLogo.file_path}`}
          alt={title}
          title={title}
          className="max-h-[150px] object-contain pointer-events-none"
        />

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
    )
  ) : (
    <div className="h-[150px] w-full max-w-[350px] animate-pulse bg-gray-400 bg-opacity-20 backdrop-blur rounded-lg"></div>
  );
}

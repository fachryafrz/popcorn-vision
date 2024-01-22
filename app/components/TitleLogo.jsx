/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { fetchData, getTitleLogo } from "../api/route";
import Reveal from "../lib/Reveal";

export default function TitleLogo({ film, images, setLoading }) {
  const [titleLogo, setTitleLogo] = useState(images);

  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");
  const isDetailPage = pathname.startsWith("/movies") || isTvPage;
  const title = !isTvPage ? film.title : film.name;

  return titleLogo ? (
    <Reveal delay={0.1} className={`w-full`}>
      <figure className="mb-4 flex justify-center md:justify-start lg:max-w-[75%]">
        <img
          src={`https://image.tmdb.org/t/p/w500${titleLogo.file_path}`}
          alt={title}
          title={title}
          className="max-h-[180px] max-w-fit object-contain bg-contain pointer-events-none"
        />

        {!images && (
          <figcaption className="sr-only">
            <h3 style={{ textWrap: `balance` }}>{title}</h3>
          </figcaption>
        )}
      </figure>
    </Reveal>
  ) : (
    <Reveal delay={0.1} className={`w-full`}>
      <h1
        className="text-center md:text-left font-bold text-3xl lg:text-5xl line-clamp-2 !leading-normal"
        style={{ textWrap: `balance` }}
      >
        {title}
      </h1>
    </Reveal>
  );
}

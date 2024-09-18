/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { fetchData, getTitleLogo } from "@/lib/fetch";
import Reveal from "../Layout/Reveal";

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
          className=" max-h-[180px] max-w-fit bg-contain object-contain"
          draggable={false}
          loading="lazy"
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
      <span aria-hidden
        className="line-clamp-2 text-center text-3xl font-bold !leading-normal md:text-left lg:text-5xl"
        style={{ textWrap: `balance` }}
      >
        {title}
      </span>
    </Reveal>
  );
}

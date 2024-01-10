/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { fetchData, getTitleLogo } from "../api/route";
import Reveal from "../lib/Reveal";

export default function TitleLogo({ film, images, setIsTitleReady }) {
  const [titleLogo, setTitleLogo] = useState(images);
  const [loading, setLoading] = useState(!images ? true : false);

  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");
  const isDetailPage = pathname.startsWith("/movies") || isTvPage;
  const title = !isTvPage ? film.title : film.name;

  useEffect(() => {
    if (!titleLogo) {
      fetchData({
        endpoint: `/${!isTvPage ? `movie` : `tv`}/${film.id}/images`,
        queryParams: {
          include_image_language: "en",
        },
      }).then((res) => {
        setTitleLogo(res.logos.find((img) => img.iso_639_1 === "en"));
        setLoading(false);
        setIsTitleReady(true);
      });
    }
  }, [film, isTvPage, setIsTitleReady, titleLogo]);

  return !loading ? (
    titleLogo ? (
      <Reveal delay={0.05}>
        <figure className="mb-4 flex justify-start lg:max-w-[75%]">
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
      </Reveal>
    ) : (
      <h1
        className="font-bold text-4xl lg:text-5xl line-clamp-1 lg:line-clamp-2 !leading-normal"
        style={{ textWrap: `balance` }}
      >
        {title}
      </h1>
    )
  ) : (
    <Reveal delay={0.05}>
      <div className="h-[150px] w-full max-w-[350px] animate-pulse bg-gray-400 bg-opacity-20 backdrop-blur rounded-lg"></div>
    </Reveal>
  );
}

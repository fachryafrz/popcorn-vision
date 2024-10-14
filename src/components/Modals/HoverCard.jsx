/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useRef } from "react";
import { fetchData } from "@/lib/fetch";
import { IonIcon } from "@ionic/react";
import { star } from "ionicons/icons";
import { AnimatePresence, motion as m } from "framer-motion";
import { formatRuntime } from "../../lib/formatRuntime";
import Reveal from "../Layout/Reveal";
import { isPlural } from "../../lib/isPlural";
import { formatRating } from "@/lib/formatRating";
import useSWR from "swr";
import { useHoverCard } from "@/zustand/hoverCard";
import ImagePovi from "../Film/ImagePovi";
import { usePathname } from "next/navigation";

export default function HoverCard() {
  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");

  // Ref
  const filmPreviewRef = useRef();

  // Global State
  const { card, setHoverCard, position, setPosition } = useHoverCard();

  useEffect(() => {
    const handleScroll = () => {
      setHoverCard(null);
      setPosition(null);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isItTvPage = (movie, tv) => {
    const type = !isTvPage ? movie : tv;
    return type;
  };

  const fetchFilmDetails = async () => {
    const res = await fetchData({
      endpoint: `/${isItTvPage(`movie`, `tv`)}/${card.id}`,
      queryParams: {
        append_to_response: "images, videos",
      },
    });
    const { images } = res;
    return {
      titleLogo: images.logos.find((img) => img.iso_639_1 === "en"),
      filmDetails: res,
      releaseDate: isItTvPage(res.release_date, res.first_air_date),
      filmRuntime: isItTvPage(res.runtime, res.episode_run_time),
    };
  };

  const { data } = useSWR(
    card && window.innerWidth >= 1536
      ? [card.id, isItTvPage(`movie`, `tv`)]
      : null,
    fetchFilmDetails,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const { titleLogo, filmDetails, releaseDate, filmRuntime } = data || {};

  return (
    <AnimatePresence>
      {data && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          ref={filmPreviewRef}
          id="film-preview"
          className={`pointer-events-none fixed z-[60] hidden w-[300px] overflow-hidden rounded-2xl bg-base-100 shadow-[rgba(0,0,0,0.5)_0px_2px_16px_0px] xl:block`}
          style={{
            top: position.top + position.height / 2 - 176,
            left:
              position.left > 17
                ? position.right < 1470
                  ? position.left + position.width / 2 - 150
                  : `unset`
                : 16,
            right: position.right < 1470 ? `unset` : 16,
          }}
        >
          {data && (
            <>
              {/* Backdrop */}
              <ImagePovi
                imgPath={
                  card.backdrop_path &&
                  `https://image.tmdb.org/t/p/w92${card.backdrop_path}`
                }
                className={`relative z-0 aspect-[4/3] overflow-hidden before:absolute before:inset-x-0 before:bottom-0 before:h-[50%] before:bg-gradient-to-t before:from-base-100`}
              >
                {card.backdrop_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w780${card.backdrop_path}`}
                    alt={isItTvPage(card.title, card.name)}
                    className={`object-cover`}
                    draggable={false}
                    loading="lazy"
                  />
                )}
              </ImagePovi>

              <div
                className={`relative z-10 -mt-[75px] flex flex-col gap-2 p-3 pb-4`}
              >
                {/* Logo */}
                <section id="Logo" className={`flex h-[75px] items-end`}>
                  {/* Logo Image */}
                  {titleLogo && (
                    <Reveal className={`h-full`} delay={0.1}>
                      <figure className={`h-full`}>
                        <img
                          src={`https://image.tmdb.org/t/p/w185${titleLogo.file_path}`}
                          alt={isItTvPage(card.title, card.name)}
                          title={isItTvPage(card.title, card.name)}
                          className={`max-w-[200px] object-contain`}
                          draggable={false}
                          loading="lazy"
                        />
                      </figure>
                    </Reveal>
                  )}

                  {/* Logo Text */}
                  {!titleLogo && (
                    <Reveal>
                      <span
                        className={`before-content line-clamp-2 text-xl font-bold`}
                        style={{ textWrap: `balance` }}
                        data-before-content={isItTvPage(card.title, card.name)}
                      />
                    </Reveal>
                  )}
                </section>

                {/* Info */}
                <section className="flex flex-wrap items-center gap-0.5 text-xs font-medium">
                  {/* Rating */}
                  {card.vote_average > 0 && (
                    <Reveal delay={0.1}>
                      <div className="flex items-center gap-1 rounded-full bg-secondary bg-opacity-20 p-1 px-2 text-primary-yellow backdrop-blur-sm">
                        <IonIcon icon={star} className="" />
                        <span
                          className="before-content !text-white"
                          data-before-content={formatRating(card.vote_average)}
                        />
                      </div>
                    </Reveal>
                  )}

                  {/* Runtime */}
                  {!isTvPage && filmRuntime > 0 && (
                    <Reveal delay={0.15}>
                      <div className="flex items-center gap-1 rounded-full bg-secondary bg-opacity-20 p-1 px-2 backdrop-blur-sm">
                        <span
                          className="before-content !text-white"
                          data-before-content={formatRuntime(filmRuntime)}
                        />
                      </div>
                    </Reveal>
                  )}

                  {/* Seasons */}
                  {isTvPage && filmDetails?.number_of_seasons > 0 && (
                    <Reveal delay={0.2}>
                      <div className="flex items-center gap-1 rounded-full bg-secondary bg-opacity-20 p-1 px-2 backdrop-blur-sm">
                        <span
                          className="before-content !text-white"
                          data-before-content={`${filmDetails.number_of_seasons} ${isPlural(
                            {
                              text: `Season`,
                              number: filmDetails.number_of_seasons,
                            },
                          )}`}
                        />
                      </div>
                    </Reveal>
                  )}

                  {/* Genres */}
                  {filmDetails?.genres.length > 0 && (
                    <Reveal delay={0.25}>
                      <div className="flex items-center gap-1 rounded-full bg-secondary bg-opacity-20 p-1 px-2 backdrop-blur-sm">
                        <span
                          className="before-content !text-white"
                          data-before-content={filmDetails?.genres[0]?.name}
                        />
                      </div>
                    </Reveal>
                  )}
                </section>

                {/* Overview */}
                <section id="Overview">
                  {card.overview && (
                    <Reveal delay={0.1}>
                      <span
                        className={`before-content line-clamp-3 text-sm font-medium text-gray-400`}
                        data-before-content={card.overview}
                      />
                    </Reveal>
                  )}
                </section>
              </div>
            </>
          )}
        </m.div>
      )}
    </AnimatePresence>
  );
}

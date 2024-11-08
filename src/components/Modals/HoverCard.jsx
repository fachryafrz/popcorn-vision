/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useRef, useState } from "react";
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
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import slug from "slug";
import FavoriteButton from "../User/Actions/FavoriteButton";
import axios from "axios";
import { useAuth } from "@/hooks/auth";
import WatchlistButton from "../User/Actions/WatchlistButton";
import moment from "moment";

export default function HoverCard() {
  const { user } = useAuth();

  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State
  const [sameWidthAsWindow, setSameWidthAsWindow] = useState(false);
  const [sameHeightAsWindow, setSameHeightAsWindow] = useState(false);

  // Ref
  const filmPreviewRef = useRef();

  // Global State
  const { card, setHoverCard, position, setPosition, handleMouseLeave } =
    useHoverCard();

  const isTvPage = card?.media_type === "tv" || !card?.title;

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
    card && position && window.innerWidth >= 1280
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

  const isUpcoming = moment(
    filmDetails?.release_date ?? filmDetails?.first_air_date,
  ).isAfter(moment());

  const swrKey = `/api/account_states?id=${card?.id}&type=${!isTvPage ? "movie" : "tv"}`;
  const fetcher = (url) => axios.get(url).then(({ data }) => data);
  const { data: accountStates } = useSWR(
    user && card ? swrKey : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  useEffect(() => {
    const handleScroll = () => {
      handleMouseLeave();
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleMouseLeave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  useEffect(() => {
    setSameWidthAsWindow(
      Number((position?.right + 40).toFixed(0)) >= window.innerWidth,
    );

    setSameHeightAsWindow(
      Number((position?.bottom + 80).toFixed(0)) >= window.innerHeight,
    );
  }, [position]);

  return (
    <AnimatePresence>
      {data && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          ref={filmPreviewRef}
          id="film-preview"
          onMouseLeave={handleMouseLeave}
          className={`pointer-events-auto fixed z-[60] hidden w-[300px] overflow-hidden rounded-2xl bg-base-100 shadow-[rgba(0,0,0,0.5)_0px_2px_16px_0px] xl:block`}
          style={{
            top:
              position.top < 80
                ? 8
                : sameHeightAsWindow
                  ? `unset`
                  : position.top + position.height / 2 - 200,
            bottom: sameHeightAsWindow ? 8 : `unset`,
            left:
              Number(position.left.toFixed(0)) > 16
                ? !sameWidthAsWindow
                  ? position.left + position.width / 2 - 150
                  : `unset`
                : 16,
            right: !sameWidthAsWindow ? `unset` : 16,
          }}
        >
          <>
            {/* Backdrop */}

            <Link
              href={`/${!isTvPage ? `movies` : `tv`}/${card.id}-${slug(card.title ?? card.name)}`}
            >
              <span className={`sr-only`}>{card.title ?? card.name}</span>

              <ImagePovi
                imgPath={card.backdrop_path}
                className={`relative z-0 aspect-[4/3] overflow-hidden before:absolute before:inset-x-0 before:bottom-0 before:h-[50%] before:bg-gradient-to-t before:from-base-100`}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w185${card.backdrop_path}`}
                  srcSet={`
                    https://image.tmdb.org/t/p/w780${card.backdrop_path} 100w
                  `}
                  sizes="100vw"
                  role="presentation"
                  alt={isItTvPage(card.title, card.name)}
                  className={`object-cover`}
                  draggable={false}
                  loading="lazy"
                />
              </ImagePovi>
            </Link>

            <div className={`relative z-10 flex flex-col gap-2 p-3 pb-4`}>
              {/* Logo */}
              <section id="Logo" className={`flex items-end`}>
                {/* Logo Image */}
                {titleLogo && (
                  <Reveal
                    className={`pointer-events-none -mt-20 h-20`}
                    delay={0.1}
                  >
                    <figure className={`h-full`}>
                      <img
                        src={`https://image.tmdb.org/t/p/w300${titleLogo.file_path}`}
                        alt={isItTvPage(card.title, card.name)}
                        // title={isItTvPage(card.title, card.name)}
                        className={`max-w-[250px] object-contain`}
                        draggable={false}
                        loading="lazy"
                        role="presentation"
                      />
                    </figure>
                  </Reveal>
                )}

                {/* Logo Text */}
                {!titleLogo && (
                  <Reveal className={`-mt-20`}>
                    <span
                      className={`line-clamp-2 text-pretty text-start text-xl font-bold`}
                    >
                      {card.title ?? card.name}
                    </span>
                  </Reveal>
                )}
              </section>

              {/* Info */}
              <section className="flex flex-wrap items-center gap-0.5 text-sm font-medium">
                {/* Rating */}
                {card.vote_average > 0 && (
                  <Reveal delay={0.1}>
                    <Link
                      href={`${!isTvPage ? `/search` : `/tv/search`}?rating=${card.vote_average.toFixed(1)}..10`}
                      className="flex items-center gap-1 rounded-full bg-secondary bg-opacity-20 p-1 px-2 text-primary-yellow backdrop-blur-sm transition-all hocus:bg-opacity-50"
                    >
                      <IonIcon icon={star} className="" />
                      <span
                        className="before-content !text-white"
                        data-before-content={formatRating(card.vote_average)}
                      />
                    </Link>
                  </Reveal>
                )}

                {/* Runtime */}
                {!isTvPage && filmRuntime > 0 && (
                  <Reveal delay={0.15}>
                    <Link
                      href={`/search?with_runtime=${filmDetails?.runtime}..300`}
                      className="flex items-center gap-1 rounded-full bg-secondary bg-opacity-20 p-1 px-2 backdrop-blur-sm transition-all hocus:bg-opacity-50"
                    >
                      <span
                        className="before-content !text-white"
                        data-before-content={formatRuntime(filmRuntime)}
                      />
                    </Link>
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
                    <Link
                      href={
                        !isTvPage
                          ? `/search?with_genres=${filmDetails?.genres[0]?.id}`
                          : `/tv/search?with_genres=${filmDetails?.genres[0]?.id}`
                      }
                      className="flex items-center gap-1 rounded-full bg-secondary bg-opacity-20 p-1 px-2 backdrop-blur-sm transition-all hocus:bg-opacity-50"
                    >
                      <span
                        className="before-content !text-white"
                        data-before-content={filmDetails?.genres[0]?.name}
                      />
                    </Link>
                  </Reveal>
                )}
              </section>

              {/* Overview */}
              <section id="Overview">
                {card.overview && (
                  <Reveal delay={0.1}>
                    <span
                      className={`line-clamp-3 text-start text-sm font-medium text-gray-400`}
                    >
                      {card.overview}
                    </span>
                  </Reveal>
                )}
              </section>

              {/* CTA */}
              <section className={`flex items-center gap-1`}>
                <Reveal delay={0.1} className={`flex-1`}>
                  <Link
                    href={`/${!isTvPage ? `movies` : `tv`}/${card.id}-${slug(card.title ?? card.name)}`}
                    className={`btn btn-primary w-full rounded-full`}
                  >
                    <span>Details</span>
                  </Link>
                </Reveal>

                {!isUpcoming && (
                  <Reveal delay={0.15}>
                    <FavoriteButton
                      swrKey={swrKey}
                      film={card}
                      favorite={accountStates?.favorite}
                      withText={false}
                      className={`!btn-square`}
                    />
                  </Reveal>
                )}

                <Reveal delay={0.2}>
                  <WatchlistButton
                    swrKey={swrKey}
                    film={card}
                    watchlist={accountStates?.watchlist}
                    withText={false}
                    className={`!btn-square`}
                  />
                </Reveal>
              </section>
            </div>
          </>
        </m.div>
      )}
    </AnimatePresence>
  );
}

/* eslint-disable @next/next/no-img-element */
"use client";

import { IonIcon } from "@ionic/react";
import {
  chevronBackCircle,
  chevronDownOutline,
  chevronForwardCircle,
  star,
} from "ionicons/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import { Keyboard, Navigation } from "swiper/modules";
import { fetchData, getEpisodes } from "@/lib/fetch";
import EpisodeCard from "./TV/EpisodeCard";
import { isPlural } from "@/lib/isPlural";
import { releaseStatus } from "@/lib/releaseStatus";
import ImagePovi from "@/components/Film/ImagePovi";
import { formatRuntime } from "@/lib/formatRuntime";

// Zustand
import { formatRating } from "@/lib/formatRating";
import { useSeasonPoster } from "@/zustand/seasonPoster";
import moment from "moment";
import { POPCORN } from "@/lib/constants";
import slug from "slug";
import useSWR from "swr";
import SkeletonEpisodeCard from "@/components/Skeleton/details/EpisodeCard";

export default function FilmCollection({ film, collection }) {
  const sortedCollections = collection?.parts.sort((a, b) => {
    const dateA = new Date(a.release_date);
    const dateB = new Date(b.release_date);

    return dateA - dateB;
  });

  const [apiData, setApiData] = useState(collection);
  const [collectionTitle, setCollectionTitle] = useState(collection?.name);
  const [collections, setCollections] = useState(sortedCollections);
  const [showAllCollection, setShowAllCollection] = useState(false);
  const [viewSeason, setViewSeason] = useState(false);
  const numCollection = 5;
  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");

  const filteredSeasons =
    isTvPage && film.seasons.filter((season) => season.season_number > 0);

  return (
    <div className={`flex flex-col gap-2`}>
      <div id="collections" className="z-10 flex flex-col gap-2 py-2">
        <h2
          className="m-0 text-xl font-bold text-white"
          style={{ textWrap: `balance` }}
        >
          {!isTvPage ? apiData && collectionTitle : `${film.name} Collection`}
        </h2>{" "}
      </div>
      <ul className="relative flex flex-col gap-1">
        {!isTvPage
          ? apiData &&
            collections
              .slice(0, showAllCollection ? collections.length : numCollection)
              .map((item, index) => {
                let popcorn = `url(${POPCORN})`;
                let filmPoster = `url(https://image.tmdb.org/t/p/w500${item.poster_path})`;

                return (
                  <li key={item.id}>
                    <CollectionItem film={film} item={item} index={index} />
                  </li>
                );
              })
          : filteredSeasons
              .slice(
                0,
                showAllCollection ? filteredSeasons.length : numCollection,
              )
              .map((item, index) => {
                return (
                  <li key={item.id}>
                    <h3 className="sr-only">
                      {item.name} (
                      {`${item.episode_count} ${isPlural({
                        text: "Episode",
                        number: item.episode_count,
                      })}`}
                      )
                    </h3>
                    {item.overview && (
                      <p className="sr-only">{item.overview}</p>
                    )}
                    <FilmSeason film={film} item={item} index={index} />
                  </li>
                );
              })}

        {(!isTvPage
          ? apiData && collections.length > numCollection
          : filteredSeasons.length > numCollection) && (
          <div
            className={`absolute inset-x-0 bottom-0 h-[200px] items-end justify-center bg-gradient-to-t from-base-100 text-primary-blue ${
              showAllCollection ? "hidden" : "flex"
            }`}
          >
            <button onClick={() => setShowAllCollection(true)}>
              View all collection
            </button>
          </div>
        )}
      </ul>
    </div>
  );
}

export function CollectionItem({
  film = null,
  item,
  index,
  type = "movie",
  userRating,
}) {
  const filmTitle = item.title ?? item.name;

  return (
    <article>
      <Link
        href={`/${type === "movie" ? "movies" : "tv"}/${item.id}-${slug(filmTitle)}`}
        prefetch={true}
        className={`flex w-full items-center gap-2 rounded-xl bg-secondary bg-opacity-10 p-2 backdrop-blur transition-all @container hocus:bg-opacity-30 ${
          film?.id === item.id && `!bg-primary-blue !bg-opacity-30`
        }`}
      >
        <span
          className={`before-content px-1 text-sm font-medium text-gray-400`}
          data-before-content={index + 1}
        />
        <ImagePovi
          imgPath={
            item.poster_path &&
            `https://image.tmdb.org/t/p/w92${item.poster_path}`
          }
          className={`flex aspect-poster min-w-[50px] max-w-[50px] items-center overflow-hidden rounded-lg bg-base-100`}
        />
        <div className="flex w-full flex-col items-start gap-1">
          <span
            className="before-content line-clamp-2 text-start font-medium"
            title={filmTitle}
            style={{ textWrap: "balance" }}
            data-before-content={filmTitle}
          />

          <h3 className="sr-only">
            {filmTitle}{" "}
            {`${item.release_date && `(${moment(item.release_date).format("YYYY")})`}`}
          </h3>

          <div
            className={`flex flex-wrap items-center gap-1 text-xs font-medium text-gray-400`}
          >
            {(userRating || item.vote_average > 1) && (
              <div
                className={`flex items-center gap-1 rounded-full bg-secondary bg-opacity-10 p-1 px-2 backdrop-blur-sm`}
              >
                <div className="rating rating-xs">
                  <input
                    class="mask mask-star-2 pointer-events-none bg-primary-yellow"
                    checked={true}
                    disabled
                  />
                </div>
                <span
                  className={`before-content`}
                  data-before-content={
                    userRating
                      ? `Your rating: ${userRating}`
                      : formatRating(item.vote_average)
                  }
                />
              </div>
            )}

            {item.release_date && (
              <div
                className={`flex items-center gap-1 rounded-full bg-secondary bg-opacity-10 p-1 px-2 backdrop-blur-sm`}
              >
                <span
                  className={`before-content`}
                  data-before-content={moment(item.release_date).format(
                    "MMM DD, YYYY",
                  )}
                />
              </div>
            )}
          </div>
        </div>
        <span
          title={item.overview}
          className="before-content hidden w-full text-xs text-gray-400 @xs:line-clamp-3"
          data-before-content={item.overview}
        />
      </Link>
    </article>
  );
}

function FilmSeason({ film, item, index }) {
  const [viewSeason, setViewSeason] = useState(false);

  const { poster, setSeasonPoster } = useSeasonPoster((state) => state);

  const samePoster = poster.includes(item.poster_path);

  const handleViewSeason = async (viewSeason) => {
    setViewSeason(viewSeason);

    if (viewSeason && item.poster_path) {
      // Update the poster array
      setSeasonPoster((prev) => [item.poster_path, ...prev]);
    }

    if (!viewSeason && poster.length > 1) {
      // Reset poster
      setSeasonPoster((prev) => {
        const firstIndex = prev.indexOf(item.poster_path);
        if (firstIndex !== -1) {
          return prev.filter((poster, index) => index !== firstIndex);
        }
        return prev;
      });
    }
  };

  return (
    <>
      <button
        onClick={() =>
          item.episode_count > 0
            ? handleViewSeason(!viewSeason)
            : setViewSeason(false)
        }
        className={`flex w-full items-center gap-2 bg-secondary bg-opacity-10 p-2 transition-all hocus:bg-opacity-30 ${
          viewSeason
            ? `rounded-t-xl !bg-primary-blue !bg-opacity-30`
            : `rounded-xl`
        }`}
      >
        <span className={`px-1 text-sm font-medium text-gray-400`}>
          {index + 1}
        </span>

        <ImagePovi
          imgPath={
            item.poster_path &&
            `https://image.tmdb.org/t/p/w92${item.poster_path}`
          }
          className={`flex aspect-poster min-w-[50px] max-w-[50px] items-center overflow-hidden rounded-lg bg-base-100`}
        />
        <div className="flex w-full flex-col items-start gap-1">
          <h3
            title={`${item.name} (${item.episode_count} ${isPlural({
              text: "Episode",
              number: item.episode_count,
            })})`}
            className="line-clamp-1 text-start font-medium md:line-clamp-2"
            style={{ textWrap: `balance` }}
          >
            {item.name}
          </h3>

          {item.episode_count > 0 ? (
            <span className="line-clamp-1 text-xs font-medium text-gray-400">
              {`${item.episode_count} ${isPlural({
                text: "Episode",
                number: item.episode_count,
              })}`}
            </span>
          ) : (
            <span className="line-clamp-1 text-xs font-medium text-gray-400">
              {releaseStatus(film.status)}
            </span>
          )}

          <div
            className={`flex flex-wrap items-center gap-1 text-xs font-medium text-gray-400`}
          >
            {item.vote_average > 1 && (
              <span
                className={`flex items-center gap-1 rounded-full bg-secondary bg-opacity-20 p-1 px-2 backdrop-blur-sm`}
              >
                <div className="rating rating-xs">
                  <input
                    class="mask mask-star-2 pointer-events-none bg-primary-yellow"
                    checked={true}
                    disabled
                  />
                </div>
                {item.vote_average && formatRating(item.vote_average)}
              </span>
            )}

            {item.air_date && (
              <span className="flex rounded-full bg-secondary bg-opacity-20 p-1 px-2 text-xs font-medium text-gray-400 backdrop-blur-sm">
                {moment(item.air_date).format("MMM D, YYYY")}
              </span>
            )}
          </div>
        </div>

        <p
          title={item.overview}
          className="hidden w-full text-start text-xs text-gray-400 sm:line-clamp-3"
        >
          {item.overview}
        </p>

        {item.episode_count > 0 && (
          <IonIcon
            icon={chevronDownOutline}
            class={`min-w-[18px] text-lg text-secondary transition-all ${
              viewSeason ? `-rotate-180` : ``
            }`}
          />
        )}
      </button>

      {viewSeason && <FilmEpisodes id={film.id} season={index + 1} />}
    </>
  );
}

function FilmEpisodes({ id, season }) {
  const { data: episodes, isLoading } = useSWR(
    `/tv/${id}/season/${season}`,
    () => getEpisodes({ id, season }),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  return (
    <div className={`rounded-b-xl bg-secondary bg-opacity-10 py-2`}>
      {isLoading && <SkeletonEpisodeCard />}

      {!isLoading && !episodes.length && (
        <div className={`flex items-center justify-center text-gray-400`}>
          No episode found
        </div>
      )}

      {!isLoading && episodes.length > 0 && (
        <>
          <Swiper
            modules={[Navigation, Keyboard]}
            keyboard={true}
            navigation={{
              enabled: true,
              prevEl: `#prevEps-${id}-${season}`,
              nextEl: `#nextEps-${id}-${season}`,
            }}
            slidesPerView={1}
            spaceBetween={4}
            breakpoints={{
              1024: {
                slidesPerView: 2,
                slidesPerGroup: 2,
              },
            }}
            className={`relative !px-2`}
          >
            {episodes.map((item) => {
              return (
                <SwiperSlide key={item.id} className={`!h-auto`}>
                  <EpisodeCard
                    filmID={id}
                    episode={item}
                    imgPath={item.still_path}
                    title={item.name}
                    overlay={`Episode ${item.episode_number}`}
                    secondaryInfo={
                      <>
                        {item.vote_average > 1 && (
                          <span
                            className={`flex items-center gap-1 rounded-full bg-secondary bg-opacity-10 p-1 px-2 backdrop-blur-sm`}
                          >
                            <div className="rating rating-xs">
                              <input
                                class="mask mask-star-2 pointer-events-none bg-primary-yellow"
                                checked={true}
                                disabled
                              />
                            </div>
                            {item.vote_average &&
                              formatRating(item.vote_average)}
                          </span>
                        )}

                        {item.runtime && (
                          <span
                            className={`flex rounded-full bg-secondary bg-opacity-10 p-1 px-2 backdrop-blur-sm`}
                          >
                            {Math.floor(item.runtime / 60) >= 1
                              ? `${Math.floor(item.runtime / 60)}h ${Math.floor(
                                  item.runtime % 60,
                                )}m`
                              : `${item.runtime} ${isPlural({
                                  text: "minute",
                                  number: item.runtime % 60,
                                })}`}
                          </span>
                        )}

                        {item.air_date && (
                          <span
                            className={`flex rounded-full bg-secondary bg-opacity-10 p-1 px-2 backdrop-blur-sm`}
                          >
                            {moment(item.air_date).format("MMM D, YYYY")}
                          </span>
                        )}
                      </>
                    }
                  />
                </SwiperSlide>
              );
            })}

            <div
              className={`pointer-events-none absolute inset-0 z-40 flex items-center justify-between`}
            >
              <button
                id={`prevEps-${id}-${season}`}
                className={`pointer-events-auto flex items-center p-2`}
              >
                <IonIcon icon={chevronBackCircle} className={`text-3xl`} />
              </button>
              <button
                id={`nextEps-${id}-${season}`}
                className={`pointer-events-auto flex items-center p-2`}
              >
                <IonIcon icon={chevronForwardCircle} className={`text-3xl`} />
              </button>
            </div>
          </Swiper>
        </>
      )}
    </div>
  );
}

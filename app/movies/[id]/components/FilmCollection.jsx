/* eslint-disable @next/next/no-img-element */

import { IonIcon } from "@ionic/react";
import axios from "axios";
import {
  calendarOutline,
  chevronBackCircle,
  chevronDownOutline,
  chevronForwardCircle,
  chevronUpOutline,
  close,
  star,
  timeOutline,
  tvOutline,
} from "ionicons/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper";
import FilmBackdrop from "./FilmBackdrop";
import Person from "./Person";
import {
  getEpisodeModal,
  getEpisodes,
  getFilmCollection,
} from "@/app/api/route";
import { slugify } from "@/app/lib/slugify";

export default function FilmCollection({
  film,
  episodeModal,
  setEpisodeModal,
  loading,
  setLoading,
}) {
  const [apiData, setApiData] = useState();
  const [collectionTitle, setCollectionTitle] = useState();
  const [collections, setCollections] = useState({});
  const [showAllCollection, setShowAllCollection] = useState(false);
  const [viewSeason, setViewSeason] = useState(false);
  const numCollection = 3;
  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");

  const handleShowAllCollection = () => {
    setShowAllCollection(true);
  };

  const handleViewSeason = () => {
    setViewSeason(!viewSeason);
  };

  useEffect(() => {
    if (film.belongs_to_collection) {
      getFilmCollection({ film }).then((res) => {
        setApiData(res);
        setCollectionTitle(res.name);
        const sortedCollections = res.parts.sort((a, b) => {
          const dateA = new Date(a.release_date);
          const dateB = new Date(b.release_date);

          return dateA - dateB;
        });
        setCollections(sortedCollections);
      });
    }

    setShowAllCollection(false);
  }, [film]);

  const filteredSeasons =
    isTvPage && film.seasons.filter((season) => season.season_number > 0);

  return (
    <div className={`flex flex-col gap-2`}>
      <div
        id="collections"
        className="flex flex-col gap-2 bg-base-100 backdrop-blur bg-opacity-[85%] sticky top-[66px] py-2 z-10"
      >
        <h2 className="font-bold text-xl text-white m-0">
          {!isTvPage ? apiData && collectionTitle : `${film.name} Collection`}
        </h2>
      </div>
      <ul className="flex flex-col gap-1 relative">
        {!isTvPage
          ? apiData &&
            collections
              .slice(0, showAllCollection ? collections.length : numCollection)
              .map((item, index) => {
                // Release Date
                const dateStr = item.release_date;
                const date = new Date(dateStr);
                const options = {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                };
                const formattedDate = date.toLocaleString("en-US", options);

                let popcorn = `url(/popcorn.png)`;
                let filmPoster = `url(https://image.tmdb.org/t/p/w500${item.poster_path})`;

                return (
                  <li key={item.id}>
                    <article>
                      <Link
                        href={`/movies/${item.id}-${slugify(item.title)}`}
                        className={`transition-all flex items-center gap-2 bg-secondary bg-opacity-10 hocus:bg-opacity-30 p-2 rounded-xl w-full ${
                          film.id === item.id &&
                          `!bg-primary-blue !bg-opacity-30`
                        }`}
                      >
                        <span
                          className={`text-gray-400 text-sm font-medium px-1`}
                        >
                          {index + 1}
                        </span>
                        <figure
                          className={`aspect-poster min-w-[50px] max-w-[50px] rounded-lg overflow-hidden flex items-center bg-base-100`}
                          style={{
                            backgroundImage:
                              item.poster_path === null ? popcorn : filmPoster,
                            backgroundSize:
                              item.poster_path === null ? "contain" : "cover",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                          }}
                        ></figure>
                        <div className="flex flex-col gap-1 items-start w-full">
                          <h3
                            className="text-start line-clamp-2 font-medium"
                            title={item.title}
                            style={{ textWrap: "balance" }}
                          >
                            {item.title}
                          </h3>
                          <div
                            className={`flex items-center gap-1 text-xs sm:text-sm text-gray-400 font-medium`}
                          >
                            {item.vote_average > 1 && (
                              <span className={`flex items-center gap-1`}>
                                <IonIcon
                                  icon={star}
                                  className={`text-primary-yellow`}
                                />
                                {item.vote_average &&
                                  item.vote_average.toFixed(1)}
                              </span>
                            )}
                            {item.vote_average > 1 && item.release_date && (
                              <span>&bull;</span>
                            )}
                            {item.release_date ? formattedDate : `Coming soon`}
                          </div>
                        </div>
                        <p
                          title={item.overview}
                          className="text-xs text-gray-400 line-clamp-3 w-full"
                        >
                          {item.overview}
                        </p>
                      </Link>
                    </article>
                  </li>
                );
              })
          : filteredSeasons
              .slice(
                0,
                showAllCollection ? filteredSeasons.length : numCollection
              )
              .map((item, index) => {
                return (
                  <li key={item.id}>
                    <FilmSeason
                      film={film}
                      item={item}
                      index={index}
                      episodeModal={episodeModal}
                      setEpisodeModal={setEpisodeModal}
                      setLoading={setLoading}
                    />
                  </li>
                );
              })}

        {(!isTvPage
          ? apiData && collections.length > numCollection
          : filteredSeasons.length > numCollection) && (
          <div
            className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-base-100 justify-center items-end h-[200px] text-primary-blue ${
              showAllCollection ? "hidden" : "flex"
            }`}
          >
            <button onClick={handleShowAllCollection}>
              View all collection
            </button>
          </div>
        )}
      </ul>
    </div>
  );
}

function FilmSeason({
  film,
  item,
  index,
  episodeModal,
  setEpisodeModal,
  setLoading,
}) {
  const [viewSeason, setViewSeason] = useState(false);
  const dateStr = item.air_date;
  const date = new Date(dateStr);
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const formattedDate = date.toLocaleString("en-US", options);

  const handleViewSeason = () => {
    setViewSeason(!viewSeason);
  };

  useEffect(() => {
    setViewSeason(false);
  }, [film]);

  return (
    <>
      <button
        onClick={
          item.episode_count > 0 ? handleViewSeason : () => setViewSeason(false)
        }
        className={`transition-all flex items-center gap-2 bg-secondary bg-opacity-10 hocus:bg-opacity-30 p-2 w-full ${
          viewSeason
            ? `rounded-t-xl !bg-primary-blue !bg-opacity-30`
            : `rounded-xl`
        }`}
      >
        <span className={`text-gray-400 text-sm font-medium px-1`}>
          {index + 1}
        </span>

        <figure
          className="aspect-poster min-w-[50px] max-w-[50px] rounded-lg overflow-hidden flex items-center"
          style={{
            backgroundImage:
              item.poster_path === null
                ? `url(/popcorn.png)`
                : `url(https://image.tmdb.org/t/p/w500${item.poster_path})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        ></figure>
        <div className="flex flex-col gap-1 items-start w-full">
          <h3
            title={`${item.name} (${item.episode_count} Episode${
              item.episode_count > 1 ? `s` : ``
            })`}
            className="text-start line-clamp-1 md:line-clamp-2 font-medium"
          >
            {item.name}
          </h3>

          <span className="text-xs sm:text-sm text-gray-400 font-medium line-clamp-1">
            {item.episode_count > 0
              ? `${item.episode_count} Episode${
                  item.episode_count > 1 ? `s` : ``
                }`
              : `Coming soon`}
          </span>

          <div
            className={`flex items-center gap-1 text-xs text-gray-400 font-medium`}
          >
            {item.vote_average > 1 && (
              <span className={`flex items-center gap-1`}>
                <IonIcon icon={star} className={`text-primary-yellow`} />
                {item.vote_average && item.vote_average.toFixed(1)}
              </span>
            )}

            {item.vote_average > 1 && item.air_date && <span>&bull;</span>}

            {item.air_date && (
              <span className="text-xs sm:text-sm text-gray-400 font-medium">
                {formattedDate}
              </span>
            )}
          </div>
        </div>

        <p
          title={item.overview}
          className="hidden text-xs text-gray-400 sm:line-clamp-3 w-full text-start"
        >
          {item.overview}
        </p>

        {item.episode_count > 0 && (
          <IonIcon
            icon={chevronDownOutline}
            class={`text-lg min-w-[18px] text-secondary transition-all ${
              viewSeason ? `-rotate-180` : ``
            }`}
          />
        )}
      </button>

      <FilmEpisodes
        id={film.id}
        season={index + 1}
        episodeModal={episodeModal}
        setEpisodeModal={setEpisodeModal}
        setLoading={setLoading}
        viewSeason={viewSeason}
      />
    </>
  );
}

function FilmEpisodes({
  id,
  season,
  episodeModal,
  setEpisodeModal,
  setLoading,
  viewSeason,
}) {
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    getEpisodes({ id, season }).then((res) => {
      setEpisodes(res);
    });
  }, [id, season]);

  return (
    viewSeason &&
    episodes && (
      <Swiper
        modules={[Navigation]}
        navigation={{
          enabled: true,
          prevEl: `#prevEps`,
          nextEl: `#nextEps`,
        }}
        slidesPerView={1}
        spaceBetween={4}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
        }}
        className={`bg-secondary bg-opacity-10 !p-2 rounded-b-xl relative`}
      >
        {episodes &&
          episodes.map((item) => {
            // Release Date
            const dateStr = item.air_date;
            const date = new Date(dateStr);
            const options = {
              year: "numeric",
              month: "long",
              day: "numeric",
            };
            const formattedDate = date.toLocaleString("en-US", options);

            return (
              <SwiperSlide key={item.id} className={`!h-auto`}>
                <button
                  onClick={() => {
                    getEpisodeModal({
                      filmID: id,
                      season: item.season_number,
                      eps: item.episode_number,
                    }).then((res) => {
                      setEpisodeModal(res);
                      setLoading(false);

                      setTimeout(() => {
                        document.getElementById(`episodeModal`).scrollTo(0, 0);
                        document.getElementById(`episodeModal`).showModal();
                      }, 100);
                    });
                  }}
                  className={`flex flex-col items-center gap-2 bg-secondary bg-opacity-10 hocus:bg-opacity-30 p-2 rounded-xl w-full h-full transition-all`}
                >
                  <figure className="aspect-video rounded-lg overflow-hidden w-full">
                    {item.still_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w500${item.still_path}`}
                        alt={item.name}
                        className={`pointer-events-none`}
                      />
                    ) : (
                      <div
                        className={`bg-base-100 w-full h-full grid place-items-center`}
                      >
                        <div
                          style={{
                            background: `url(/popcorn.png)`,
                            backgroundSize: `contain`,
                          }}
                          className={`aspect-square h-full`}
                        ></div>
                      </div>
                    )}
                  </figure>
                  <div className="flex flex-col gap-1 items-start w-full">
                    <h3
                      className="text-start line-clamp-2 font-medium"
                      title={item.name}
                      style={{ textWrap: `balance` }}
                    >
                      {item.name}
                    </h3>

                    <div
                      className={`flex items-center gap-1 text-xs text-gray-400 font-medium`}
                    >
                      {item.vote_average > 1 && (
                        <span className={`flex items-center gap-1`}>
                          <IonIcon
                            icon={star}
                            className={`text-primary-yellow`}
                          />
                          {item.vote_average && item.vote_average.toFixed(1)}
                        </span>
                      )}

                      {item.vote_average > 1 && item.air_date && (
                        <span>&bull;</span>
                      )}

                      {item.runtime && (
                        <span>
                          {Math.floor(item.runtime / 60) >= 1
                            ? `${Math.floor(item.runtime / 60)}h ${Math.floor(
                                item.runtime % 60
                              )}m`
                            : `${item.runtime} minute${
                                item.runtime % 60 > 1 && `s`
                              }`}
                        </span>
                      )}

                      {item.air_date && item.runtime && <span>&bull;</span>}

                      {item.air_date && <span>{formattedDate}</span>}
                    </div>
                  </div>

                  {/* <p className="text-xs text-gray-400 w-full text-start">
                  {item.overview}
                </p> */}
                </button>
              </SwiperSlide>
            );
          })}

        {/* {episode && (
        <EpisodeModal
          episode={episode}
          episodeModalRef={episodeModalRef}
          loading={loading}
        />
      )} */}

        <div
          className={`absolute inset-0 flex justify-between z-40 pointer-events-none`}
        >
          <button
            id={`prevEps`}
            className={`pointer-events-auto flex items-center p-1`}
          >
            <IonIcon icon={chevronBackCircle} className={`text-3xl`} />
          </button>
          <button
            id={`nextEps`}
            className={`pointer-events-auto flex items-center p-1`}
          >
            <IonIcon icon={chevronForwardCircle} className={`text-3xl`} />
          </button>
        </div>
      </Swiper>
    )
  );
}

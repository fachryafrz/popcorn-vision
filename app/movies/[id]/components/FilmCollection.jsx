/* eslint-disable @next/next/no-img-element */

import { IonIcon } from "@ionic/react";
import {
  chevronBackCircle,
  chevronDownOutline,
  chevronForwardCircle,
  star,
} from "ionicons/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper";
import { getEpisodes, getFilmCollection } from "@/app/api/route";
import { slugify } from "@/app/lib/slugify";
import EpisodeCard from "./EpisodeCard";
import { formatDate } from "@/app/lib/formatDate";
import { isPlural } from "@/app/lib/isPlural";
import { releaseStatus } from "@/app/lib/releaseStatus";
import { DetailsContext } from "../context";
import ImagePovi from "@/app/components/ImagePovi";

export default function FilmCollection({ film, setLoading }) {
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
      <div id="collections" className="flex flex-col gap-2 py-2 z-10">
        <h2 className="font-bold text-xl text-white m-0" style={{ textWrap: `balance` }}>
          {!isTvPage ? apiData && collectionTitle : `${film.name} Collection`}
        </h2>
      </div>
      <ul className="flex flex-col gap-1 relative">
        {!isTvPage
          ? apiData &&
            collections
              .slice(0, showAllCollection ? collections.length : numCollection)
              .map((item, index) => {
                let popcorn = `url(/popcorn.png)`;
                let filmPoster = `url(https://image.tmdb.org/t/p/w500${item.poster_path})`;

                return (
                  <li key={item.id}>
                    <article>
                      <Link
                        href={`/movies/${item.id}-${slugify(item.title)}`}
                        className={`transition-all flex items-center gap-2 bg-secondary bg-opacity-10 backdrop-blur hocus:bg-opacity-30 p-2 rounded-xl w-full ${
                          film.id === item.id &&
                          `!bg-primary-blue !bg-opacity-30`
                        }`}
                      >
                        <span
                          className={`text-gray-400 text-sm font-medium px-1`}
                        >
                          {index + 1}
                        </span>
                        <ImagePovi
                          imgPath={
                            item.poster_path &&
                            `https://image.tmdb.org/t/p/w92${item.poster_path}`
                          }
                          className={`aspect-poster min-w-[50px] max-w-[50px] rounded-lg overflow-hidden flex items-center bg-base-100`}
                        />
                        <div className="flex flex-col gap-1 items-start w-full">
                          <h3
                            className="text-start line-clamp-2 font-medium"
                            title={item.title}
                            style={{ textWrap: "balance" }}
                          >
                            {item.title}
                          </h3>
                          <div
                            className={`flex items-center gap-1 text-xs text-gray-400 font-medium flex-wrap`}
                          >
                            {item.vote_average > 1 && (
                              <span
                                className={`flex items-center gap-1 p-1 px-2 bg-secondary bg-opacity-10 backdrop-blur-sm rounded-full`}
                              >
                                <IonIcon
                                  icon={star}
                                  className={`text-primary-yellow`}
                                />
                                {item.vote_average &&
                                  item.vote_average.toFixed(1)}
                              </span>
                            )}

                            {item.release_date && (
                              <span
                                className={`flex p-1 px-2 bg-secondary bg-opacity-10 backdrop-blur-sm rounded-full`}
                              >
                                {formatDate({
                                  date: item.release_date,
                                  showDay: false,
                                })}
                              </span>
                            )}
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

function FilmSeason({ film, item, index, setLoading }) {
  const [viewSeason, setViewSeason] = useState(false);

  const { setActiveSeasonPoster } = useContext(DetailsContext);

  const handleViewSeason = async () => {
    setViewSeason(!viewSeason);

    if (!viewSeason) {
      setActiveSeasonPoster(item);
    } else {
      setActiveSeasonPoster(null);
    }
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

        <ImagePovi
          imgPath={
            item.poster_path &&
            `https://image.tmdb.org/t/p/w92${item.poster_path}`
          }
          className={`aspect-poster min-w-[50px] bg-base-100 max-w-[50px] rounded-lg overflow-hidden flex items-center`}
        />
        <div className="flex flex-col gap-1 items-start w-full">
          <h3
            title={`${item.name} (${item.episode_count} ${isPlural({
              text: "Episode",
              number: item.episode_count,
            })})`}
            className="text-start line-clamp-1 md:line-clamp-2 font-medium"
          >
            {item.name}
          </h3>

          {item.episode_count > 0 ? (
            <span className="text-xs text-gray-400 font-medium line-clamp-1">
              {`${item.episode_count} ${isPlural({
                text: "Episode",
                number: item.episode_count,
              })}`}
            </span>
          ) : (
            <span className="text-xs text-gray-400 font-medium line-clamp-1">
              {releaseStatus(film.status)}
            </span>
          )}

          <div
            className={`flex items-center gap-1 text-xs text-gray-400 font-medium flex-wrap`}
          >
            {item.vote_average > 1 && (
              <span
                className={`flex items-center gap-1 p-1 px-2 bg-secondary bg-opacity-20 backdrop-blur-sm rounded-full`}
              >
                <IonIcon icon={star} className={`text-primary-yellow`} />
                {item.vote_average && item.vote_average.toFixed(1)}
              </span>
            )}

            {item.air_date && (
              <span className="text-xs text-gray-400 font-medium flex p-1 px-2 bg-secondary bg-opacity-20 backdrop-blur-sm rounded-full">
                {formatDate({ date: item.air_date, showDay: false })}
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
        setLoading={setLoading}
        viewSeason={viewSeason}
      />
    </>
  );
}

function FilmEpisodes({ id, season, setLoading, viewSeason }) {
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
          1024: {
            slidesPerView: 2,
          },
        }}
        className={`bg-secondary bg-opacity-10 !p-2 rounded-b-xl relative`}
      >
        {episodes &&
          episodes.map((item) => {
            return (
              <SwiperSlide key={item.id} className={`!h-auto`}>
                <EpisodeCard
                  filmID={id}
                  setLoading={setLoading}
                  episode={item}
                  imgPath={item.still_path}
                  title={item.name}
                  overlay={`Episode ${item.episode_number}`}
                  secondaryInfo={
                    <>
                      {item.vote_average > 1 && (
                        <span
                          className={`flex items-center gap-1 p-1 px-2 bg-secondary bg-opacity-10 backdrop-blur-sm rounded-full`}
                        >
                          <IonIcon
                            icon={star}
                            className={`text-primary-yellow`}
                          />
                          {item.vote_average && item.vote_average.toFixed(1)}
                        </span>
                      )}

                      {item.runtime && (
                        <span
                          className={`flex p-1 px-2 bg-secondary bg-opacity-10 backdrop-blur-sm rounded-full`}
                        >
                          {Math.floor(item.runtime / 60) >= 1
                            ? `${Math.floor(item.runtime / 60)}h ${Math.floor(
                                item.runtime % 60
                              )}m`
                            : `${item.runtime} ${isPlural({
                                text: "minute",
                                number: item.runtime % 60,
                              })}`}
                        </span>
                      )}

                      {item.air_date && (
                        <span
                          className={`flex p-1 px-2 bg-secondary bg-opacity-10 backdrop-blur-sm rounded-full`}
                        >
                          {formatDate({ date: item.air_date })}
                        </span>
                      )}
                    </>
                  }
                />
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

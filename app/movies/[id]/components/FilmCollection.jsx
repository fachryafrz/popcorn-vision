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

export default function FilmCollection({ film }) {
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
    const fetchCollections = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/collection/${film.belongs_to_collection.id}
          `,
          {
            params: {
              api_key: "84aa2a7d5e4394ded7195035a4745dbd",
            },
          }
        );
        setApiData(res.data);
        setCollectionTitle(res.data.name);
        const sortedCollections = res.data.parts.sort((a, b) => {
          const dateA = new Date(a.release_date);
          const dateB = new Date(b.release_date);

          return dateA - dateB;
        });
        setCollections(sortedCollections);
      } catch (error) {
        console.error(`Errornya collections: ${error}`);
      }
    };

    if (film.belongs_to_collection) {
      fetchCollections();
    }

    setShowAllCollection(false);
  }, [film]);

  function slugify(text) {
    return (
      text &&
      text
        .toLowerCase()
        .replace(/&/g, "")
        .replace(/ /g, "-")
        .replace(/-+/g, "-")
        .replace(/[^\w-]+/g, "")
    );
  }

  const filteredSeasons =
    isTvPage && film.seasons.filter((season) => season.season_number > 0);

  return (
    <div className={`flex flex-col gap-2`}>
      <div
        id="collections"
        className="flex flex-col gap-2 bg-base-100 backdrop-blur bg-opacity-[85%] sticky top-[4.125rem] py-2 z-10"
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
                    <Link
                      href={`/movies/${item.id}-${slugify(item.title)}`}
                      className={`flex items-center gap-2 bg-secondary bg-opacity-10 hocus:bg-opacity-30 p-2 rounded-xl w-full ${
                        film.id === item.id && `!bg-primary-blue !bg-opacity-30`
                      }`}
                    >
                      <span
                        className={`text-gray-400 text-sm font-medium px-1`}
                      >
                        {index + 1}
                      </span>

                      <figure
                        className={`aspect-poster min-w-[50px] max-w-[50px] rounded-lg overflow-hidden flex items-center`}
                        style={{
                          backgroundImage:
                            item.poster_path === null ? popcorn : filmPoster,
                          backgroundSize: "cover",
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
                    <FilmSeason film={film} item={item} index={index} />
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

function FilmSeason({ film, item, index }) {
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
        className={`flex items-center gap-2 bg-secondary bg-opacity-10 hocus:bg-opacity-30 p-2 w-full ${
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
            {`${item.episode_count} Episode${
              item.episode_count > 1 ? `s` : ``
            }`}
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
            icon={viewSeason ? chevronUpOutline : chevronDownOutline}
            class={`text-lg min-w-[18px] text-secondary`}
          />
        )}
      </button>

      {viewSeason && <FilmEpisodes id={film.id} season={index + 1} />}
    </>
  );
}

function FilmEpisodes({ id, season }) {
  const [episodes, setEpisodes] = useState([]);
  const [episode, setEpisode] = useState([]);
  const [loading, setLoading] = useState(true);

  const episodeModalRef = useRef();
  const fetchEpisodeModal = async (filmID, season, eps) => {
    setLoading(true);

    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/tv/${filmID}/season/${season}/episode/${eps}`,
        {
          params: {
            api_key: "84aa2a7d5e4394ded7195035a4745dbd",
          },
        }
      );
      setLoading(false);
      setEpisode(res.data);
      episodeModalRef.current.showModal();
    } catch (error) {
      console.error(`Errornya episode modal: ${error}`);
    }
  };

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/tv/${id}/season/${season}`,
          {
            params: {
              api_key: "84aa2a7d5e4394ded7195035a4745dbd",
            },
          }
        );
        setEpisodes(res.data.episodes);
      } catch (error) {
        console.error(`Errornya collections: ${error}`);
      }
    };

    fetchEpisodes();
  }, [id, season]);

  return (
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
                onClick={() =>
                  fetchEpisodeModal(id, season, item.episode_number)
                }
                className={`flex flex-col items-center gap-2 bg-secondary bg-opacity-10 hocus:bg-opacity-30 p-2 rounded-xl w-full h-full`}
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

      {episode && (
        <EpisodeModal
          episode={episode}
          episodeModalRef={episodeModalRef}
          loading={loading}
        />
      )}

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
  );
}

export function EpisodeModal({ episode, episodeModalRef, loading }) {
  const [showAllGuestStars, setShowAllGuestStars] = useState(false);
  const numGuestStars = 10;

  const handleShowAllGuestStars = () => {
    setShowAllGuestStars(true);
  };

  // Format Date
  const dateStr = episode.air_date;
  const date = new Date(dateStr);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = date.toLocaleString("en-US", options);

  // Release Day
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const releaseDayIndex = new Date(dateStr).getDay();
  const releaseDay = dayNames[releaseDayIndex];

  useEffect(() => {
    setShowAllGuestStars(false);
  }, [episode]);

  return (
    <dialog
      ref={episodeModalRef}
      id={`episodeModal`}
      className={`modal backdrop:bg-black backdrop:bg-opacity-75 backdrop:backdrop-blur overflow-y-auto`}
    >
      <div className={`p-4 sm:py-8 relative w-full max-w-3xl`}>
        <div className={`pointer-events-none absolute inset-0 p-4 sm:py-8`}>
          <button
            onClick={() => episodeModalRef.current.close()}
            className={`grid place-content-center aspect-square sticky top-0 ml-auto z-50 p-4 pointer-events-auto`}
          >
            <IonIcon icon={close} className={`text-3xl`} />
          </button>
        </div>

        <div
          className={`modal-box max-w-none w-full p-0 relative max-h-none overflow-y-hidden`}
        >
          {loading ? (
            <div
              className={`aspect-video animate-pulse bg-gray-400 bg-opacity-20 relative before:absolute before:inset-0 before:bg-gradient-to-t before:from-base-100`}
            ></div>
          ) : (
            <figure
              className={`aspect-video relative before:absolute before:inset-0 before:bg-gradient-to-t before:from-base-100 overflow-hidden z-0`}
              style={{
                backgroundImage:
                  episode.still_path === null
                    ? `url(/popcorn.png)`
                    : `https://image.tmdb.org/t/p/w92${episode.still_path}`,
                backgroundSize: `contain`,
                backgroundRepeat: `no-repeat`,
                backgroundPosition: `center`,
              }}
            >
              {episode.still_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w1280${episode.still_path}`}
                  alt={episode.name}
                  className={`object-cover`}
                />
              )}
            </figure>
          )}
          <div className={`p-8 -mt-[75px] z-10 relative flex flex-col gap-6`}>
            <h1
              title={episode.name}
              className={`text-3xl text-center font-bold`}
              style={{ textWrap: `balance` }}
            >
              {episode.name}
            </h1>

            {episode.episode_type && (
              <span
                className={`bg-primary-blue bg-opacity-[10%] text-primary-blue flex text-center max-w-fit p-2 px-4 rounded-full mx-auto capitalize`}
              >
                {episode.episode_type}
              </span>
            )}

            <div className={`flex flex-col gap-2`}>
              <section id={`Episode Air Date`}>
                <div className={`flex items-center gap-2`}>
                  <IonIcon icon={calendarOutline} />
                  <time dateTime={episode.air_date}>
                    {`${releaseDay}, ${formattedDate}`}
                  </time>
                </div>
              </section>
              <section
                id={`TV Series Chapter`}
                className={`flex items-center gap-2`}
              >
                <IonIcon icon={tvOutline} />
                <span>
                  {`Season ${episode.season_number} (Episode ${episode.episode_number})`}
                </span>
              </section>
              <section id={`TV Series Average Episode Runtime`}>
                {Math.floor(episode.runtime / 60) >= 1 ? (
                  <>
                    <div className={`flex items-center gap-2`}>
                      <IonIcon icon={timeOutline} />
                      <time>
                        {Math.floor(episode.runtime / 60)}h{" "}
                        {episode.runtime % 60}m
                      </time>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`flex items-center gap-2`}>
                      <IonIcon icon={timeOutline} />
                      <time>
                        {episode.runtime % 60} minute
                        {episode.runtime % 60 > 1 && `s`}
                      </time>
                    </div>
                  </>
                )}
              </section>
            </div>

            {episode.overview != "" && (
              <section id={`Episode Overview`}>
                <h2 className={`font-bold text-xl text-white`}>Overview</h2>
                <p className={`text-gray-400 md:text-lg`}>{episode.overview}</p>
              </section>
            )}

            {episode.guest_stars && episode.guest_stars.length > 0 && (
              <section id={`Guest Stars`}>
                <h2 className={`font-bold text-xl text-white py-2`}>
                  Guest Stars
                </h2>

                <div className={`grid sm:grid-cols-2 gap-4 relative`}>
                  {episode.guest_stars
                    .slice(
                      0,
                      showAllGuestStars
                        ? episode.guest_stars.length
                        : numGuestStars
                    )
                    .map((item) => {
                      return (
                        <Person
                          key={item.id}
                          id={item.id}
                          name={item.name}
                          profile_path={
                            item.profile_path === null
                              ? null
                              : `https://image.tmdb.org/t/p/w185${item.profile_path}`
                          }
                          role={item.character}
                        />
                      );
                    })}

                  {episode.guest_stars.length > numGuestStars && (
                    <div
                      className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-base-100 justify-center items-end h-[200px] text-primary-blue ${
                        showAllGuestStars ? `hidden` : `flex`
                      }`}
                    >
                      <button onClick={handleShowAllGuestStars}>
                        View all
                      </button>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* <form method={`dialog`} className={`modal-backdrop`}>
        <button>close</button>
      </form> */}
    </dialog>
  );
}

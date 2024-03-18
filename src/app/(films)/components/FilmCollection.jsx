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
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import { Keyboard, Navigation } from "swiper/modules";
import { fetchData, getEpisodes, getFilmCollection } from "@/lib/fetch";
import { slugify } from "@/lib/slugify";
import EpisodeCard from "./EpisodeCard";
import { formatDate } from "@/lib/formatDate";
import { isPlural } from "@/lib/isPlural";
import { releaseStatus } from "@/lib/releaseStatus";
import ImagePovi from "@/components/Film/ImagePovi";
import { formatRuntime } from "@/lib/formatRuntime";

// Redux Toolkit
import { useSelector, useDispatch } from "react-redux";
import { setSeasonPoster } from "@/redux/slices/seasonPosterSlice";
import { formatRating } from "@/lib/formatRating";

export default function FilmCollection({ film, setLoading, collection }) {
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
  const numCollection = 3;
  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");

  const handleShowAllCollection = () => {
    setShowAllCollection(true);
  };

  const handleViewSeason = () => {
    setViewSeason(!viewSeason);
  };

  // useEffect(() => {
  //   if (film.belongs_to_collection) {
  //     getFilmCollection({ film }).then((res) => {
  //       setApiData(res);
  //       setCollectionTitle(res.name);
  //       const sortedCollections = res.parts.sort((a, b) => {
  //         const dateA = new Date(a.release_date);
  //         const dateB = new Date(b.release_date);

  //         return dateA - dateB;
  //       });
  //       setCollections(sortedCollections);
  //     });
  //   }

  //   setShowAllCollection(false);
  // }, [film]);

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
                let popcorn = `url(/popcorn.png)`;
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
            className={`absolute inset-x-0 bottom-0 h-[200px] items-end justify-center bg-gradient-to-t from-base-100 text-primary-blue ${
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

function CollectionItem({ film, item, index }) {
  const [filmDetails, setFilmDetails] = useState();

  useEffect(() => {
    const fetchFilmDetails = async () => {
      await fetchData({
        endpoint: `/movie/${item.id}`,
      }).then((res) => {
        setFilmDetails(res);
      });
    };

    fetchFilmDetails();
  }, [item]);

  return (
    <article>
      <Link
        href={`/movies/${item.id}-${slugify(item.title)}`}
        className={`flex w-full items-center gap-2 rounded-xl bg-secondary bg-opacity-10 p-2 backdrop-blur transition-all hocus:bg-opacity-30 ${
          film.id === item.id && `!bg-primary-blue !bg-opacity-30`
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
            className="line-clamp-2 text-start font-medium"
            title={item.title}
            style={{ textWrap: "balance" }}
          >
            {item.title}
          </h3>
          <div
            className={`flex flex-wrap items-center gap-1 text-xs font-medium text-gray-400`}
          >
            {item.vote_average > 1 && (
              <span
                className={`flex items-center gap-1 rounded-full bg-secondary bg-opacity-10 p-1 px-2 backdrop-blur-sm`}
              >
                <IonIcon icon={star} className={`text-primary-yellow`} />
                {item.vote_average && formatRating(item.vote_average)}
              </span>
            )}

            {filmDetails && (
              <span
                className={`flex rounded-full bg-secondary bg-opacity-10 p-1 px-2 backdrop-blur-sm`}
              >
                {formatRuntime(filmDetails.runtime)}
              </span>
            )}
          </div>
        </div>
        <p
          title={item.overview}
          className="line-clamp-3 w-full text-xs text-gray-400"
        >
          {item.overview}
        </p>
      </Link>
    </article>
  );
}

function FilmSeason({ film, item, index, setLoading }) {
  const [viewSeason, setViewSeason] = useState(false);

  const dispatch = useDispatch();

  const handleViewSeason = async () => {
    setViewSeason(!viewSeason);

    if (!viewSeason) {
      // Redux Toolkit
      dispatch(setSeasonPoster(item));
    } else {
      // Redux Toolkit
      dispatch(setSeasonPoster(null));
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
                <IonIcon icon={star} className={`text-primary-yellow`} />
                {item.vote_average && formatRating(item.vote_average)}
              </span>
            )}

            {item.air_date && (
              <span className="flex rounded-full bg-secondary bg-opacity-20 p-1 px-2 text-xs font-medium text-gray-400 backdrop-blur-sm">
                {formatDate({ date: item.air_date, showDay: false })}
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
        modules={[Navigation, Keyboard]}
        keyboard={true}
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
        className={`relative rounded-b-xl bg-secondary bg-opacity-10 !p-2`}
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
                          className={`flex items-center gap-1 rounded-full bg-secondary bg-opacity-10 p-1 px-2 backdrop-blur-sm`}
                        >
                          <IonIcon
                            icon={star}
                            className={`text-primary-yellow`}
                          />
                          {item.vote_average && formatRating(item.vote_average)}
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
          className={`pointer-events-none absolute inset-0 z-40 flex justify-between`}
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

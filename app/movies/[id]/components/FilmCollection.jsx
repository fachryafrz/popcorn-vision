/* eslint-disable @next/next/no-img-element */

import { IonIcon } from "@ionic/react";
import axios from "axios";
import {
  chevronBackCircle,
  chevronDownOutline,
  chevronForwardCircle,
  chevronUpOutline,
} from "ionicons/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper";

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

    fetchCollections();
    setShowAllCollection(false);
  }, [film]);

  function slugify(text) {
    return (
      text &&
      text
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "")
    );
  }

  const filteredSeasons =
    isTvPage && film.seasons.filter((season) => season.season_number > 0);

  return (
    <div className={`flex flex-col gap-2`}>
      <div id="collections" className="flex flex-col gap-2 ">
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
                return (
                  <li key={item.id}>
                    <Link
                      href={`/movies/${item.id}-${slugify(item.title)}`}
                      className={`flex items-center gap-2 bg-base-gray bg-opacity-10 hocus:bg-opacity-30 p-2 rounded-xl w-full ${
                        film.id === item.id && `bg-primary-blue bg-opacity-30`
                      }`}
                    >
                      <span
                        className={`text-gray-400 text-sm font-medium px-1`}
                      >
                        {index + 1}
                      </span>

                      <div className="aspect-poster min-w-[50px] max-w-[50px] rounded-lg overflow-hidden flex items-center">
                        {item.poster_path ? (
                          <figure className={`w-full`}>
                            <img
                              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                              alt={item.title}
                              className={`object-contain`}
                            />
                          </figure>
                        ) : (
                          <figure
                            style={{
                              background: `url(/popcorn.png)`,
                              backgroundSize: `contain`,
                            }}
                            className={`aspect-square w-[50px]`}
                          ></figure>
                        )}
                      </div>
                      <div className="flex flex-col gap-1 items-start w-full">
                        <h3
                          className="text-start line-clamp-2 font-medium"
                          title={item.title}
                        >
                          {item.title}
                        </h3>

                        <div className="text-sm text-gray-400 font-medium">
                          {item.release_date
                            ? new Date(item.release_date).getFullYear()
                            : `Coming soon`}
                        </div>
                      </div>

                      <p className="text-xs text-gray-400 line-clamp-3 w-full">
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
            className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-base-dark-gray justify-center items-end h-[200px] text-primary-blue ${
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

  const handleViewSeason = () => {
    setViewSeason(!viewSeason);
  };

  useEffect(() => {
    setViewSeason(false);
  }, [film]);

  return (
    <>
      <button
        onClick={handleViewSeason}
        className={`flex items-center gap-2 bg-base-gray bg-opacity-10 hocus:bg-opacity-30 p-2 w-full ${
          viewSeason
            ? `rounded-t-xl bg-primary-blue bg-opacity-30`
            : `rounded-xl`
        }`}
      >
        <span className={`text-gray-400 text-sm font-medium px-1`}>
          {index + 1}
        </span>

        <div className="aspect-poster min-w-[50px] max-w-[50px] rounded-lg overflow-hidden flex items-center">
          {item.poster_path ? (
            <figure className={`w-full`}>
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={item.name}
                className={`object-contain`}
              />
            </figure>
          ) : (
            <figure
              style={{
                background: `url(/popcorn.png)`,
                backgroundSize: `contain`,
              }}
              className={`aspect-square w-[50px]`}
            ></figure>
          )}
        </div>
        <div className="flex flex-col gap-1 items-start w-full">
          <h3 className="text-start line-clamp-2 font-medium" title={item.name}>
            {item.name}
          </h3>

          <div className="text-sm text-gray-400 font-medium">
            {item.air_date
              ? new Date(item.air_date).getFullYear()
              : `Coming soon`}
          </div>
        </div>

        <p
          title={item.overview}
          className="text-xs text-gray-400 line-clamp-3 w-full text-start"
        >
          {item.overview}
        </p>

        <IonIcon
          icon={viewSeason ? chevronUpOutline : chevronDownOutline}
          class={`text-lg min-w-[18px] text-base-gray`}
        />
      </button>

      {viewSeason && <FilmEpisodes id={film.id} season={index + 1} />}
    </>
  );
}

function FilmEpisodes({ id, season }) {
  const [episodes, setEpisodes] = useState([]);

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
      slidesPerView={2}
      spaceBetween={4}
      className={`bg-base-gray bg-opacity-10 !p-2 rounded-b-xl relative`}
    >
      {episodes &&
        episodes.map((item) => {
          return (
            <SwiperSlide key={item.id} className={`!h-auto`}>
              <button
                className={`flex flex-col items-center gap-2 bg-base-gray bg-opacity-10 hocus:bg-opacity-30 p-2 rounded-xl w-full h-full`}
              >
                <figure className="aspect-video rounded-lg overflow-hidden w-full">
                  {item.still_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${item.still_path}`}
                      alt={item.name}
                    />
                  ) : (
                    <div
                      className={`bg-base-dark-gray w-full h-full grid place-items-center`}
                    >
                      <div
                        style={{
                          background: `url(/popcorn.png)`,
                          backgroundSize: `contain`,
                        }}
                        className={`aspect-square w-[50px]`}
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

                  <div className="text-sm text-gray-400 font-medium">
                    {item.air_date
                      ? new Date(item.air_date).getFullYear()
                      : `Coming soon`}
                  </div>
                </div>

                {/* <p className="text-xs text-gray-400 w-full text-start">
                  {item.overview}
                </p> */}
              </button>
            </SwiperSlide>
          );
        })}

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

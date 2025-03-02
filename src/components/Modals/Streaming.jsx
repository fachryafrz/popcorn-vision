"use client";

import { IonIcon } from "@ionic/react";
import { chevronDown, close, helpCircle, rocket, star } from "ionicons/icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import FilmSummary from "../Film/Summary";
import useSWR from "swr";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode, Mousewheel } from "swiper/modules";
import EpisodeCard from "../Film/Details/TV/EpisodeCard";
import { formatRating } from "@/lib/formatRating";
import { formatRuntime } from "@/lib/formatRuntime";
import pluralize from "pluralize";
import moment from "moment";
import SkeletonEpisodeCard from "../Skeleton/details/EpisodeCard";
import slug from "slug";
import ImagePovi from "../Film/ImagePovi";
import { streamingProviderList } from "@/lib/streamingProviderList";
import { useStreamingProvider } from "@/zustand/streamingProvider";
import Link from "next/link";

export default function Streaming() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = new URLSearchParams(Array.from(searchParams.entries()));
  const streaming = searchParams.get("streaming");

  const [origin, type, id] = pathname.split("/");

  const isTv = type === "tv";
  const media_type = type === "movies" ? "movie" : "tv";
  const filmID = id?.split("-")[0];

  const season = Number(searchParams.get("season")) || 1;
  const episode = Number(searchParams.get("episode")) || 1;

  const { streamingProvider, setStreamingProvider } = useStreamingProvider();
  const providerList = streamingProviderList({
    media_type,
    id: filmID,
    season,
    episode,
  });
  const selectedProvider = providerList.find(
    (p) => p.title === streamingProvider,
  );

  const handleClose = () => {
    current.delete("streaming");

    router.replace(`${pathname}?${current.toString()}`, { scroll: false });
  };

  const { data: film, isLoading } = useSWR(
    streaming ? (!isTv ? `/api/movie/${filmID}` : `/api/tv/${filmID}`) : null,
    (url) =>
      axios
        .get(url, {
          params: {
            append_to_response: "images",
          },
        })
        .then(({ data }) => data),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  useEffect(() => {
    if (!streaming) return;

    if (searchParams.get("season") && searchParams.get("episode"))
      document.getElementById("episodeModal").close();

    document.getElementById("streaming").showModal();
  }, [streaming, searchParams]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      {streaming === "true" && (
        <dialog
          id="streaming"
          onCancel={(e) => e.preventDefault()}
          className="modal block overflow-y-auto backdrop:bg-black backdrop:bg-opacity-90 backdrop:backdrop-blur"
        >
          <div className={`mx-auto max-w-7xl space-y-4 p-4 pt-0`}>
            {/* Close */}
            <form
              method="dialog"
              onSubmit={handleClose}
              className={`pointer-events-none sticky top-0 z-50 !mt-0 p-4 xl:pr-0 [&_*]:pointer-events-none`}
            >
              <div className={`sticky top-0 -mx-4 flex justify-end`}>
                <button type="submit" className={`!pointer-events-auto flex`}>
                  <IonIcon icon={close} style={{ fontSize: 30 }} />
                </button>
              </div>
            </form>

            {/* Screen */}
            <div className="z-0 -mx-4 !mt-0 aspect-video md:aspect-[2.39/1]">
              <iframe
                width={"100%"}
                height={"100%"}
                allowFullScreen={true}
                src={selectedProvider?.source}
              ></iframe>
            </div>

            {/* Streaming Provider */}
            <StreamingProvider
              media_type={media_type}
              id={filmID}
              season={season}
              episode={episode}
            />

            {/* Title */}
            <div className={`w-full`}>
              {isLoading && <SummarySkeleton />}

              {film && (
                <FilmSummary
                  film={film}
                  showButton={false}
                  clampDescription={false}
                  className={`md:!max-w-[80%]`}
                />
              )}
            </div>

            {/* Movie Collection */}
            {!isTv && film?.belongs_to_collection && (
              <MovieCollection film={film} detailsLoading={isLoading} />
            )}

            {/* Seasons & Episodes */}
            {isTv && (
              <Season film={film} season={season} detailsLoading={isLoading} />
            )}
          </div>
        </dialog>
      )}
    </>
  );
}

function StreamingProvider({ media_type, id, season, episode }) {
  const { streamingProvider, setStreamingProvider } = useStreamingProvider();

  const providerList = streamingProviderList({
    media_type,
    id,
    season,
    episode,
  });

  const [isActive, setIsActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (provider) => {
    setStreamingProvider(provider.title);
    setIsActive(false);
  };

  const info = [
    {
      icon: <IonIcon icon={star} className="text-primary-yellow" />,
      title: "Recommended",
    },
    {
      icon: <IonIcon icon={rocket} className="text-primary-red" />,
      title: "Fast Server",
    },
    {
      icon: (
        <div className={`text-primary-blue`}>
          <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 512 512"
            class="text-primary-500"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M157.52 272h36.96L176 218.78 157.52 272zM352 256c-13.23 0-24 10.77-24 24s10.77 24 24 24 24-10.77 24-24-10.77-24-24-24zM464 64H48C21.5 64 0 85.5 0 112v288c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48zM250.58 352h-16.94c-6.81 0-12.88-4.32-15.12-10.75L211.15 320h-70.29l-7.38 21.25A16 16 0 0 1 118.36 352h-16.94c-11.01 0-18.73-10.85-15.12-21.25L140 176.12A23.995 23.995 0 0 1 162.67 160h26.66A23.99 23.99 0 0 1 212 176.13l53.69 154.62c3.61 10.4-4.11 21.25-15.11 21.25zM424 336c0 8.84-7.16 16-16 16h-16c-4.85 0-9.04-2.27-11.98-5.68-8.62 3.66-18.09 5.68-28.02 5.68-39.7 0-72-32.3-72-72s32.3-72 72-72c8.46 0 16.46 1.73 24 4.42V176c0-8.84 7.16-16 16-16h16c8.84 0 16 7.16 16 16v160z"></path>
          </svg>
        </div>
      ),
      title: "May contain popup ads",
    },
  ];

  return (
    <div className={`flex w-full items-center justify-center gap-2`}>
      {/* Dropdown */}
      <div className={`relative w-full max-w-80`}>
        {/* Button */}
        <button
          onClick={() => setIsActive(!isActive)}
          className="relative flex w-full cursor-pointer flex-col items-start justify-start rounded-lg bg-base-100 p-2 px-4 py-2"
        >
          <span className={`text-sm text-gray-400`}>Selected provider</span>
          <span className={`font-medium`}>{streamingProvider}</span>

          <div
            className={`absolute right-4 top-1/2 flex aspect-square -translate-y-1/2 transition-all ${isActive ? "rotate-180" : ""}`}
          >
            <IonIcon icon={chevronDown} />
          </div>
        </button>

        {/* Menu */}
        {isActive && (
          <ul className="absolute left-1/2 z-[1] my-1 max-h-[200px] w-full max-w-80 -translate-x-1/2 overflow-y-auto rounded-lg bg-base-100 p-2 shadow lg:bottom-full">
            {providerList.map((provider) => (
              <li key={provider.title}>
                <button
                  onClick={() => handleClick(provider)}
                  className={`flex w-full items-center gap-2 rounded-md p-2 text-start hover:bg-base-300 ${
                    streamingProvider === provider.title ? "bg-base-300" : ""
                  }`}
                >
                  {provider.title}

                  {provider.recommended && (
                    <IonIcon icon={star} className="text-primary-yellow" />
                  )}

                  {provider.fast && (
                    <IonIcon icon={rocket} className="text-primary-red" />
                  )}

                  {provider.ads && (
                    <div className={`text-primary-blue`}>
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        stroke-width="0"
                        viewBox="0 0 512 512"
                        class="text-primary-500"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M157.52 272h36.96L176 218.78 157.52 272zM352 256c-13.23 0-24 10.77-24 24s10.77 24 24 24 24-10.77 24-24-10.77-24-24-24zM464 64H48C21.5 64 0 85.5 0 112v288c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48zM250.58 352h-16.94c-6.81 0-12.88-4.32-15.12-10.75L211.15 320h-70.29l-7.38 21.25A16 16 0 0 1 118.36 352h-16.94c-11.01 0-18.73-10.85-15.12-21.25L140 176.12A23.995 23.995 0 0 1 162.67 160h26.66A23.99 23.99 0 0 1 212 176.13l53.69 154.62c3.61 10.4-4.11 21.25-15.11 21.25zM424 336c0 8.84-7.16 16-16 16h-16c-4.85 0-9.04-2.27-11.98-5.68-8.62 3.66-18.09 5.68-28.02 5.68-39.7 0-72-32.3-72-72s32.3-72 72-72c8.46 0 16.46 1.73 24 4.42V176c0-8.84 7.16-16 16-16h16c8.84 0 16 7.16 16 16v160z"></path>
                      </svg>
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Info */}
      <div
        onMouseOver={() => setIsHovered(true)}
        onMouseOut={() => setIsHovered(false)}
        className={`group relative`}
      >
        <div className={`flex`}>
          <IonIcon
            icon={helpCircle}
            style={{ fontSize: 24 }}
            className={`cursor-help`}
          />
        </div>

        <div
          className={`absolute top-full right-0 lg:right-auto lg:left-full lg:top-1/2 ml-1 lg:-translate-y-1/2 rounded-lg bg-base-200 p-4 transition-all ${
            isHovered ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <ul className={`space-y-2`}>
            {info.map((item, i) => (
              <li key={i} className={`flex items-center gap-2`}>
                <div className={`flex`}>{item.icon}</div>
                <span className={`whitespace-nowrap`}>{item.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function MovieCollection({ film, detailsLoading }) {
  const searchParams = useSearchParams();
  const current = new URLSearchParams(Array.from(searchParams.entries()));
  const belongsToCollection = film.belongs_to_collection;

  const { data: collection, isLoading } = useSWR(
    belongsToCollection && `/api/collection/${belongsToCollection.id}`,
    (url) => axios.get(url).then(({ data }) => data),
  );

  const handleWatchMovie = () => {
    document.getElementById("streaming").scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className={`w-full space-y-2 py-4 pt-0 @container`}>
      {isLoading && detailsLoading && <CollectionSkeleton />}

      {/* Header */}
      <div className={`text-lg font-bold sm:text-2xl`}>
        {film?.belongs_to_collection.name}
      </div>

      {/* Collection */}
      <ul
        className={`grid grid-cols-3 gap-2 @2xl:grid-cols-4 @5xl:grid-cols-5 @6xl:grid-cols-6`}
      >
        {collection?.parts
          .sort((a, b) => new Date(a.release_date) - new Date(b.release_date))
          .map((item) => (
            <li key={item.id}>
              <Link
                href={{
                  pathname: `/movies/${item.id}-${slug(item.title)}`,
                  query: current.toString(),
                }}
                prefetch={false}
                onClick={handleWatchMovie}
                className={`group relative block overflow-hidden rounded-xl ${!item.release_date || moment(item.release_date).isAfter() ? `pointer-events-none` : ``}`}
              >
                <ImagePovi
                  imgPath={item.poster_path}
                  className={`relative aspect-poster overflow-hidden transition-all duration-500 ${moment(item.release_date).isAfter() ? `` : `group-hover:scale-105`}`}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                    role="presentation"
                    loading="lazy"
                    draggable={false}
                    alt=""
                    aria-hidden
                    width={100}
                    height={150}
                  />
                </ImagePovi>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}

function Season({ film, season, detailsLoading }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = new URLSearchParams(Array.from(searchParams.entries()));
  const streaming = searchParams.get("streaming");

  const [selectedSeason, setSelectedSeason] = useState(season || 1);
  const [episodeSwiper, setEpisodeSwiper] = useState();

  const seasons = film?.seasons.filter((season) => season.season_number > 0);

  const { data: episodes, isLoading } = useSWR(
    streaming ? `/api/tv/${film?.id}/season/${selectedSeason}` : null,
    (url) => axios.get(url).then(({ data }) => data.episodes),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const handleWatchEpisode = (item) => {
    document.getElementById("streaming").scrollTo({
      top: 0,
      behavior: "smooth",
    });

    current.set("season", selectedSeason);
    current.set("episode", item.episode_number);

    router.replace(`${pathname}?${current.toString()}`, { scroll: false });
  };

  useEffect(() => {
    setSelectedSeason(season);
  }, [season]);

  return (
    <div className={`mt-4 w-full space-y-2 pb-4`}>
      {/* Header */}
      <Swiper
        modules={[FreeMode, Mousewheel]}
        freeMode={true}
        mousewheel={true}
        slidesPerView={`auto`}
        spaceBetween={24}
        className={`!px-4`}
      >
        {seasons?.map((season) => (
          <SwiperSlide key={season.id} className={`!max-w-fit`}>
            <button
              onClick={() => {
                setSelectedSeason(season.season_number);
                episodeSwiper.slideTo(0, 0);
              }}
              className={`select-none text-lg font-bold transition-all hover:text-neutral-500 sm:text-2xl ${selectedSeason === season.season_number ? "text-white hover:text-white" : "text-neutral-600"}`}
            >
              {`Season ${season.season_number}`}
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Episodes */}
      {(detailsLoading || isLoading) && (
        <div className={`space-y-2 !px-4`}>
          {detailsLoading && (
            <ul className={`flex gap-6`}>
              {[...Array(3)].map((_, i) => (
                <li
                  key={i}
                  className={`block h-8 w-24 animate-pulse rounded bg-gray-400 bg-opacity-20`}
                ></li>
              ))}
            </ul>
          )}

          {isLoading && (
            <SkeletonEpisodeCard
              numberOfEps={8}
              className=""
              breakpoints={{
                768: {
                  slidesPerView: 2,
                  slidesPerGroup: 2,
                },
                1024: {
                  slidesPerView: 3,
                  slidesPerGroup: 3,
                },
                1280: {
                  slidesPerView: 4,
                  slidesPerGroup: 4,
                },
              }}
            />
          )}
        </div>
      )}

      {episodes?.length === 0 && (
        <div
          className={`flex h-[300px] items-center justify-center text-neutral-400`}
        >
          No episode found
        </div>
      )}

      {episodes?.length > 0 && (
        <Swiper
          onSwiper={setEpisodeSwiper}
          modules={[FreeMode]}
          freeMode={true}
          slidesPerView={`auto`}
          spaceBetween={4}
          breakpoints={{
            768: {
              slidesPerView: 2,
              slidesPerGroup: 2,
            },
            1024: {
              slidesPerView: 3,
              slidesPerGroup: 3,
            },
            1280: {
              slidesPerView: 4,
              slidesPerGroup: 4,
            },
          }}
          className={`!px-4`}
        >
          {episodes?.map((item) => (
            <SwiperSlide key={item.id} className={`!h-auto`}>
              <EpisodeCard
                onClick={() => handleWatchEpisode(item)}
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
                            className="mask mask-star-2 pointer-events-none bg-primary-yellow"
                            checked={true}
                            disabled
                          />
                        </div>
                        {item.vote_average && formatRating(item.vote_average)}
                      </span>
                    )}

                    {item.runtime && (
                      <span
                        className={`flex rounded-full bg-secondary bg-opacity-10 p-1 px-2 backdrop-blur-sm`}
                      >
                        {item.runtime > 60
                          ? formatRuntime(item.runtime)
                          : pluralize("minute", item.runtime % 60, true)}
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
          ))}
        </Swiper>
      )}
    </div>
  );
}

function SummarySkeleton() {
  const loadingClass = `animate-pulse bg-gray-400 bg-opacity-20 rounded`;

  return (
    <div
      className={`mx-auto flex w-full max-w-none flex-col items-center justify-end gap-2 md:items-start md:[&_*]:max-w-[80%]`}
    >
      {/* Title Logo */}
      <div className={`${loadingClass} h-[100px] w-full !max-w-[350px]`}></div>
      {/* Rating, Runtime, Season, Genre */}
      <div
        className={`flex w-full items-center justify-center gap-1 md:justify-start [&_*]:w-full [&_*]:!max-w-[75px]`}
      >
        <div className={`${loadingClass} h-8 w-full !rounded-full`}></div>
        <div className={`${loadingClass} h-8 w-full !rounded-full`}></div>
        <div className={`${loadingClass} h-8 w-full !rounded-full`}></div>
      </div>
      {/* Overview */}
      <div
        className={`flex w-full flex-col items-start gap-1 [&_*]:!max-w-none`}
      >
        <div className={`${loadingClass} h-4 w-full`}></div>
        <div className={`${loadingClass} h-4 w-full`}></div>
        <div className={`${loadingClass} h-4 w-full`}></div>
        <div className={`${loadingClass} h-4 w-full`}></div>
        <div className={`${loadingClass} h-4 w-[80%]`}></div>
      </div>
    </div>
  );
}

function CollectionSkeleton() {
  const loadingClass = `animate-pulse bg-gray-400 bg-opacity-20 rounded`;

  return (
    <>
      {/* Header */}
      <div className={`${loadingClass} h-7 w-40 sm:h-8 lg:w-44`}></div>

      {/* Collection */}
      <ul
        className={`grid grid-cols-3 gap-2 @2xl:grid-cols-4 @5xl:grid-cols-5 @6xl:grid-cols-6`}
      >
        {[...Array(3)].map((_, i) => (
          <li key={i}>
            <div className={`${loadingClass} aspect-poster rounded-xl`}></div>
          </li>
        ))}
      </ul>
    </>
  );
}

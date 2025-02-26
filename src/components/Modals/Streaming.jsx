"use client";

import { IonIcon } from "@ionic/react";
import { close } from "ionicons/icons";
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
import Link from "next/link";
import slug from "slug";
import ImagePovi from "../Film/ImagePovi";

export default function Streaming() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = new URLSearchParams(Array.from(searchParams.entries()));
  const streaming = searchParams.get("streaming");

  const [origin, type, id] = pathname.split("/");

  const isTv = type === "tv";
  const mediaType = type === "movies" ? "movie" : "tv";
  const filmID = id?.split("-")[0];

  const season = Number(searchParams.get("season")) || 1;
  const episode = Number(searchParams.get("episode")) || 1;

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

  useEffect(() => {
    window.addEventListener("message", (event) => {
      if (event.origin !== "https://vidlink.pro") return;

      if (event.data?.type === "MEDIA_DATA") {
        const mediaData = event.data.data;
        localStorage.setItem("watch-history", JSON.stringify(mediaData));
      }
    });
  }, []);

  return (
    <>
      {streaming && (
        <dialog
          id="streaming"
          onCancel={(e) => e.preventDefault()}
          className="modal block gap-4 space-y-4 overflow-y-auto backdrop:bg-black backdrop:bg-opacity-90 backdrop:backdrop-blur"
        >
          {/* Screen */}
          <div className="z-0 aspect-video h-full w-full lg:px-16">
            {streaming && "true" && (
              <iframe
                width={"100%"}
                height={"100%"}
                allowFullScreen={true}
                src={`https://vidlink.pro/${mediaType}/${type === "movies" ? filmID : `${filmID}/${season || 1}/${episode || 1}`}?primaryColor=0278fd&secondaryColor=a2a2a2&iconColor=eefdec&icons=default&player=default&title=true&poster=false&autoplay=true&nextbutton=true`}
              ></iframe>
            )}
          </div>

          {/* Title */}
          <div className={`w-full px-4 pb-4 lg:px-16`}>
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

          {/* Close */}
          <form
            method="dialog"
            onSubmit={handleClose}
            className={`pointer-events-none fixed inset-0 z-50 !mt-0 [&_*]:pointer-events-none`}
          >
            <div className={`sticky top-0 flex justify-end p-4`}>
              <button type="submit" className={`!pointer-events-auto flex`}>
                <IonIcon icon={close} style={{ fontSize: 30 }} />
              </button>
            </div>
          </form>
        </dialog>
      )}
    </>
  );
}

function MovieCollection({ film, detailsLoading }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = new URLSearchParams(Array.from(searchParams.entries()));
  const belongsToCollection = film.belongs_to_collection;

  const { data: collection, isLoading } = useSWR(
    belongsToCollection && `/api/collection/${belongsToCollection.id}`,
    (url) => axios.get(url).then(({ data }) => data),
  );

  const handleWatchMovie = (item) => {
    document.getElementById("streaming").scrollTo({
      top: 0,
      behavior: "smooth",
    });

    router.push(
      `/movies/${item.id}-${slug(item.title)}?${current.toString()}`,
      { scroll: false },
    );
  };

  return (
    <div className={`!mt-0 w-full space-y-2 p-4 pt-0 @container lg:px-16`}>
      {isLoading && detailsLoading && <CollectionSkeleton />}

      {/* Header */}
      <div className={`text-lg font-bold sm:text-2xl`}>
        {film?.belongs_to_collection.name}
      </div>

      {/* Collection */}
      <ul
        className={`grid grid-cols-3 gap-2 @2xl:grid-cols-4 @5xl:grid-cols-5 @6xl:grid-cols-6`}
      >
        {collection?.parts.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => handleWatchMovie(item)}
              disabled={moment(item.release_date).isAfter()}
              prefetch={false}
              className={`group relative overflow-hidden rounded-xl`}
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
            </button>
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
        className={`!px-4 lg:!px-16`}
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
        <div className={`space-y-2 !px-4 lg:!px-16`}>
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
          className={`!px-4 lg:!px-16`}
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

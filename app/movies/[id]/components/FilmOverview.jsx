/* eslint-disable @next/next/no-img-element */
"use client";

import TitleLogo from "@/app/components/TitleLogo";
import React, { useEffect, useState } from "react";

// Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/autoplay";
import "swiper/css/zoom";
import FilmMedia from "./FilmMedia";
import FilmCollection from "./FilmCollection";
import FilmReviews from "./FilmReviews";
import { usePathname } from "next/navigation";
import { IonIcon } from "@ionic/react";
import {
  arrowRedoOutline,
  calendarOutline,
  timeOutline,
  tvOutline,
} from "ionicons/icons";
import ShareModal from "./ShareModal";
import axios from "axios";
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

export default function FilmOverview({
  film,
  videos,
  images,
  reviews,
  credits,
  providers,
}) {
  const [location, setLocation] = useState(null);
  const [language, setLanguage] = useState("id-ID");
  const [userLocation, setUserLocation] = useState();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation(position.coords);
      });
    }
  }, []);

  useEffect(() => {
    if (location) {
      const { latitude, longitude } = location;

      axios
        .get(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        )
        .then((response) => {
          if (response.data.countryCode !== "ID") {
            setLanguage("en-US");
          }
          setUserLocation(response.data);
        });
    }
  }, [location]);

  let providersArray = Object.entries(providers.results);

  let providersIDArray =
    userLocation &&
    providersArray.find((item) => item[0] === userLocation.countryCode);

  const [URL, setURL] = useState("");
  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");

  const isItTvPage = (movie, tv) => {
    const type = !isTvPage ? movie : tv;
    return type;
  };

  // Release Date
  const dateStr = isItTvPage(film.release_date, film.first_air_date);
  const date = new Date(dateStr);
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const formattedDate = date.toLocaleString("en-US", options);

  const timeLeft = new Date(date - new Date());
  const daysRemaining = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const monthsLeft = Math.floor(daysRemaining / 30);
  const daysLeft = daysRemaining % 30;
  const hoursLeft = timeLeft.getUTCHours();
  const minutesLeft = timeLeft.getUTCMinutes();
  const secondsLeft = timeLeft.getUTCSeconds();

  const isUpcoming = date > new Date();
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const releaseDayIndex = date.getDay();
  const lastReleaseDayIndex = new Date(film.last_air_date).getDay();
  const releaseDay = dayNames[releaseDayIndex];
  const lastReleaseDay = dayNames[lastReleaseDayIndex];

  const [countdown, setCountdown] = useState({
    months: monthsLeft,
    days: daysLeft,
    hours: hoursLeft,
    minutes: minutesLeft,
    seconds: secondsLeft,
  });

  useEffect(() => {
    setURL(window.location.href);

    const interval = setInterval(() => {
      const timeLeft = new Date(date - new Date());
      const daysRemaining = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const monthsLeft = Math.floor(daysRemaining / 30);
      const daysLeft = daysRemaining % 30;
      const hoursLeft = timeLeft.getUTCHours();
      const minutesLeft = timeLeft.getUTCMinutes();
      const secondsLeft = timeLeft.getUTCSeconds();
      setCountdown({
        months: monthsLeft,
        days: daysLeft,
        hours: hoursLeft,
        minutes: minutesLeft,
        seconds: secondsLeft,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [date]);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "Shared via Popcorn Vision",
        // text: "Check out this amazing film!",
        url: URL,
      });
    } catch (error) {
      console.error("Error sharing content:", error);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 5000); // Reset copied state after 2 seconds
    } catch (error) {
      console.error("Error copying text:", error);
    }
  };

  const [isActive, setIsActive] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-6 self-start w-full">
        <div className="flex gap-4 flex-col items-center md:items-stretch md:flex-row lg:gap-0">
          <div className="flex flex-col gap-1">
            <div className="sticky top-20 flex flex-col gap-1">
              <figure className="w-[50vw] md:w-[25vw] lg:hidden aspect-poster rounded-lg overflow-hidden self-start shadow-xl relative">
                <div
                  className={
                    film.poster_path === null
                      ? `w-full h-full bg-base-100`
                      : `hidden`
                  }
                >
                  <img
                    loading="lazy"
                    src={`/popcorn.png`}
                    alt={process.env.APP_NAME}
                    className="object-contain"
                  />
                </div>

                <img
                  loading="lazy"
                  src={`https://image.tmdb.org/t/p/w500${film.poster_path}`}
                  alt={isItTvPage(film.title, film.name)}
                  className={film.poster_path === null ? `hidden` : `block`}
                />

                {/* {film.vote_average > 0 && (
                  <div
                    className={`absolute top-0 left-0 text-xs font-semibold aspect-square grid place-items-center rounded-full border-2 w-9 m-2 bg-base-100 bg-opacity-50 backdrop-blur-sm ${
                      film.vote_average >= 1 && film.vote_average <= 3
                        ? `border-primary-red`
                        : film.vote_average >= 4 && film.vote_average <= 7
                        ? `border-primary-yellow`
                        : `border-green-500`
                    }`}
                  >
                    {film.vote_average.toFixed(1)}
                  </div>
                )} */}

                {film.vote_average > 0 && (
                  <div
                    className={`absolute top-0 left-0 m-2 p-1 bg-base-100 bg-opacity-50 backdrop-blur-sm rounded-full`}
                  >
                    <div
                      className={`radial-progress text-sm font-semibold ${
                        film.vote_average > 0 && film.vote_average < 3
                          ? `text-primary-red`
                          : film.vote_average >= 3 && film.vote_average < 7
                          ? `text-primary-yellow`
                          : `text-green-500`
                      }`}
                      style={{
                        "--value": film.vote_average * 10,
                        "--size": "36px",
                        "--thickness": "3px",
                      }}
                    >
                      <span className={`text-white`}>
                        {film.vote_average < 9.9
                          ? film.vote_average.toFixed(1)
                          : film.vote_average}
                      </span>
                    </div>
                  </div>
                )}
              </figure>
            </div>
          </div>
          <div className="flex flex-col items-center md:justify-center md:items-start gap-2 md:gap-0 w-full">
            {images.logos.length > 0 ? (
              <>
                <TitleLogo film={film} />

                <h1
                  title={isItTvPage(film.title, film.name)}
                  className="sr-only"
                  itemProp="name"
                >
                  {isItTvPage(film.title, film.name)}
                </h1>
              </>
            ) : (
              <h1
                title={isItTvPage(film.title, film.name)}
                className="max-w-fit font-bold text-2xl lg:text-5xl line-clamp-2 md:line-clamp-3 md:py-2 !leading-tight text-center md:text-start"
                itemProp="name"
              >
                {isItTvPage(film.title, film.name)}
              </h1>
            )}

            <table
              className={`w-full text-sm lg:text-base [&_td]:leading-loose [&_th]:text-left [&_th]:whitespace-nowrap [&_th]:pr-2 md:[&_th]:pr-6 [&_th]:w-[100px] [&_th]:font-normal [&_th]:hidden`}
            >
              {film.production_companies &&
                film.production_companies.length > 0 && (
                  <tr>
                    {/* <th className="text-gray-400 whitespace-nowrap">
                        Produced by
                      </th> */}
                    {/* <td className={` line-clamp-1`}>
                        {film.production_companies
                          .map((item) => item.name)
                          .join(", ")}
                      </td> */}
                    <td colSpan="2" className={`lg:hidden`}>
                      <div
                        className={`flex gap-4 flex-wrap justify-center md:justify-start`}
                      >
                        {film.production_companies.map(
                          (item, i) =>
                            item.logo_path !== null && (
                              <div
                                key={i}
                                itemProp="productionCompany"
                                itemScope
                                itemType="http://schema.org/Organization"
                              >
                                <img
                                  key={item.id}
                                  src={`https://image.tmdb.org/t/p/w500${item.logo_path}`}
                                  alt={item.name}
                                  title={item.name}
                                  className={`object-contain w-[120px] aspect-[3/2] inline grayscale invert hover:grayscale-0 hover:invert-0 transition-all`}
                                />
                                <span className={`sr-only`} itemProp="name">
                                  {item.name}
                                </span>
                              </div>
                            )
                        )}
                      </div>
                    </td>
                  </tr>
                )}

              {film.release_date || film.first_air_date ? (
                <tr>
                  <th className="text-gray-400">
                    {!isTvPage ? `Release Date` : `Air Date`}
                  </th>
                  {!isTvPage ? (
                    <td>
                      <meta
                        itemProp="datePublished"
                        content={film.release_date}
                      />
                      <div className={`flex items-center gap-2`}>
                        <IonIcon icon={calendarOutline} />

                        <time dateTime={film.release_date}>
                          {`${releaseDay}, ${formattedDate}`}
                        </time>
                      </div>
                    </td>
                  ) : (
                    <td>
                      <meta
                        itemProp="datePublished"
                        content={film.first_air_date}
                      />
                      <div className={`flex items-center gap-2`}>
                        <IonIcon icon={calendarOutline} />

                        <time dateTime={film.first_air_date}>
                          {`${releaseDay}, ${formattedDate}`}{" "}
                          {film.last_air_date !== null &&
                            film.last_air_date !== film.first_air_date && (
                              <span className="hidden xs:inline">
                                {`- ${lastReleaseDay}, ${new Date(
                                  film.last_air_date
                                ).toLocaleString("en-US", options)}`}
                              </span>
                            )}
                        </time>
                      </div>
                    </td>
                  )}
                </tr>
              ) : null}

              {isTvPage &&
                film.number_of_seasons > 0 &&
                film.number_of_episodes > 0 && (
                  <tr>
                    <th className="text-gray-400">Chapter</th>
                    <td>
                      <div className={`flex items-center gap-2`}>
                        <IonIcon icon={tvOutline} />

                        <span>
                          {`${film.number_of_seasons} Season${
                            film.number_of_seasons > 1 ? `s` : ``
                          }`}{" "}
                          {`(${film.number_of_episodes} Episode${
                            film.number_of_episodes > 1 ? `s` : ``
                          })`}
                        </span>
                      </div>
                    </td>
                  </tr>
                )}

              {!isTvPage
                ? film.runtime > 0 && (
                    <tr>
                      <th className="text-gray-400">Runtime</th>

                      {Math.floor(film.runtime / 60) >= 1 ? (
                        <td>
                          <meta
                            itemProp="duration"
                            content={`PT${film.runtime}M`}
                          />
                          <div className={`flex items-center gap-2`}>
                            <IonIcon icon={timeOutline} />
                            <time>{film.runtime} minutes</time>
                            <time>
                              ({Math.floor(film.runtime / 60)}h{" "}
                              {film.runtime % 60}m)
                            </time>
                          </div>
                        </td>
                      ) : (
                        <td>
                          <meta
                            itemProp="duration"
                            content={`PT${film.runtime}M`}
                          />
                          <div className={`flex items-center gap-2`}>
                            <IonIcon icon={timeOutline} />

                            <time>
                              {film.runtime % 60} minute
                              {film.runtime % 60 > 1 && `s`}
                            </time>
                          </div>
                        </td>
                      )}
                    </tr>
                  )
                : film.episode_run_time.length > 0 && (
                    <tr>
                      <th className="text-gray-400">Runtime</th>

                      {Math.floor(film.episode_run_time[0] / 60) >= 1 ? (
                        <td>
                          <meta
                            itemProp="duration"
                            content={`PT${film.episode_run_time}M`}
                          />
                          <div className={`flex items-center gap-2`}>
                            <IonIcon icon={timeOutline} />

                            <time>
                              {Math.floor(film.episode_run_time[0] / 60)}h{" "}
                              {film.episode_run_time[0] % 60}m
                            </time>
                          </div>
                        </td>
                      ) : (
                        <td>
                          <meta
                            itemProp="duration"
                            content={`PT${film.episode_run_time}M`}
                          />
                          <div className={`flex items-center gap-2`}>
                            <IonIcon icon={timeOutline} />

                            <time>
                              {film.episode_run_time[0] % 60} minute
                              {film.episode_run_time[0] % 60 > 1 && `s`}
                            </time>
                          </div>
                        </td>
                      )}
                    </tr>
                  )}

              {film.genres && film.genres.length > 0 && (
                <tr>
                  <th className="text-gray-400">Genre</th>

                  {/* <td>{film.genres.map((item) => item.name).join(", ")}</td> */}

                  <td className="py-1 gap-1 flex flex-wrap">
                    {film.genres.map((item) => {
                      return (
                        <span
                          key={item.id}
                          className={`p-1 px-3 bg-secondary bg-opacity-50 rounded-full backdrop-blur-sm`}
                          itemProp="genre"
                        >
                          {item.name}
                        </span>
                      );
                    })}
                  </td>
                </tr>
              )}

              {!isTvPage
                ? credits &&
                  credits.crew.length > 0 &&
                  credits.crew.find((person) => person.job === "Director") && (
                    <tr>
                      <th className="text-gray-400 whitespace-nowrap">
                        Directed by
                      </th>
                      <td className={`flex items-center gap-2`}>
                        {credits.crew.find(
                          (person) => person.job === "Director"
                        ).profile_path === null ? (
                          <figure
                            style={{
                              background: `url(/popcorn.png)`,
                              backgroundSize: `contain`,
                            }}
                            className={`aspect-square w-[50px]`}
                          ></figure>
                        ) : (
                          <figure
                            style={{
                              background: `url(https://image.tmdb.org/t/p/w185${
                                credits.crew.find(
                                  (person) => person.job === "Director"
                                ).profile_path
                              })`,
                              backgroundSize: `cover`,
                              backgroundPosition: `center`,
                            }}
                            className={`aspect-square w-[50px] rounded-full`}
                          ></figure>
                        )}
                        <div
                          className="flex flex-col"
                          itemProp="director"
                          itemScope
                          itemType="http://schema.org/Person"
                        >
                          <span className="font-medium h-7" itemProp="name">
                            {
                              credits.crew.find(
                                (person) => person.job === "Director"
                              ).name
                            }
                          </span>
                          <span className="text-sm text-gray-400 ">
                            {
                              credits.crew.find(
                                (person) => person.job === "Director"
                              ).job
                            }
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
                : film.created_by.length > 0 && (
                    <tr>
                      <th className="text-gray-400 whitespace-nowrap">
                        Directed by
                      </th>
                      <td className={`flex flex-wrap items-center gap-2`}>
                        {film.created_by.map((item, index) => {
                          return (
                            <div
                              key={index}
                              className={`flex items-center gap-2`}
                            >
                              {item.profile_path === null ? (
                                <img
                                  src={`/popcorn.png`}
                                  alt={item.name}
                                  className={`aspect-square w-[50px] rounded-full object-contain`}
                                />
                              ) : (
                                <img
                                  src={`https://image.tmdb.org/t/p/w185${item.profile_path}`}
                                  alt={item.name}
                                  className={`aspect-square w-[50px] rounded-full`}
                                />
                              )}
                              <div
                                className={`flex flex-col`}
                                itemProp="director"
                                itemScope
                                itemType="http://schema.org/Person"
                              >
                                <span
                                  className="font-medium h-7"
                                  itemProp="name"
                                >
                                  {item.name}
                                </span>
                                <span className="text-sm text-gray-400 ">
                                  {`Creator`}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </td>
                    </tr>
                  )}

              {providers.results && providersIDArray ? (
                <tr>
                  <th className="text-gray-400 whitespace-nowrap">Providers</th>

                  <td>
                    <div className="flex flex-col gap-1 justify-center md:justify-start py-4">
                      <span className={`text-gray-400 text-sm italic`}>
                        Where to watch?
                      </span>

                      <div className={`flex gap-2 flex-wrap`}>
                        {providersIDArray[1].rent
                          ? providersIDArray[1].rent.map(
                              (item) =>
                                item.logo_path !== null && (
                                  <img
                                    key={item.provider_id}
                                    src={`https://image.tmdb.org/t/p/w500${item.logo_path}`}
                                    alt={item.provider_name}
                                    title={item.provider_name}
                                    className={`object-contain w-[40px] aspect-square inline rounded-xl`}
                                  />
                                )
                            )
                          : providersIDArray[1].buy
                          ? providersIDArray[1].buy.map(
                              (item) =>
                                item.logo_path !== null && (
                                  <img
                                    key={item.provider_id}
                                    src={`https://image.tmdb.org/t/p/w500${item.logo_path}`}
                                    alt={item.provider_name}
                                    title={item.provider_name}
                                    className={`object-contain w-[40px] aspect-square inline rounded-xl`}
                                  />
                                )
                            )
                          : providersIDArray[1].flatrate.map(
                              (item) =>
                                item.logo_path !== null && (
                                  <img
                                    key={item.provider_id}
                                    src={`https://image.tmdb.org/t/p/w500${item.logo_path}`}
                                    alt={item.provider_name}
                                    title={item.provider_name}
                                    className={`object-contain w-[40px] aspect-square inline rounded-xl`}
                                  />
                                )
                            )}
                      </div>
                    </div>
                  </td>
                </tr>
              ) : location ? (
                providersIDArray && (
                  <tr>
                    <div className={`py-4`}>
                      <span className={`text-gray-400 text-sm italic`}>
                        Where to watch? <br /> Hold on we&apos;re still
                        finding...
                      </span>
                    </div>
                  </tr>
                )
              ) : (
                <tr>
                  <div className={`py-4`}>
                    <span className={`text-gray-400 text-sm italic`}>
                      Where to watch? <br /> Please enable location services to
                      find out where to watch this film.
                    </span>
                  </div>
                </tr>
              )}

              <tr>
                <td
                  className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${
                    isUpcoming ? `mt-4` : `mt-0`
                  }`}
                >
                  {isUpcoming && (
                    <div className="flex flex-wrap justify-center gap-2 text-center">
                      {countdown.months > 0 && (
                        <div className="flex flex-col p-2 bg-secondary bg-opacity-20 backdrop-blur-sm rounded-box text-neutral-content">
                          <span className="countdown font-mono text-5xl">
                            <span
                              style={{ "--value": countdown.months }}
                            ></span>
                          </span>
                          month{countdown.months > 1 ? `s` : ``}
                        </div>
                      )}
                      {countdown.days > 0 && (
                        <div className="flex flex-col p-2 bg-secondary bg-opacity-20 backdrop-blur-sm rounded-box text-neutral-content">
                          <span className="countdown font-mono text-5xl">
                            <span style={{ "--value": countdown.days }}></span>
                          </span>
                          day{countdown.days > 1 ? `s` : ``}
                        </div>
                      )}
                      <div className="flex flex-col p-2 bg-secondary bg-opacity-20 backdrop-blur-sm rounded-box text-neutral-content">
                        <span className="countdown font-mono text-5xl">
                          <span style={{ "--value": countdown.hours }}></span>
                        </span>
                        hour{countdown.hours > 1 ? `s` : ``}
                      </div>
                      <div className="flex flex-col p-2 bg-secondary bg-opacity-20 backdrop-blur-sm rounded-box text-neutral-content">
                        <span className="countdown font-mono text-5xl">
                          <span style={{ "--value": countdown.minutes }}></span>
                        </span>
                        min
                      </div>
                      <div className="flex flex-col p-2 bg-secondary bg-opacity-20 backdrop-blur-sm rounded-box text-neutral-content">
                        <span className="countdown font-mono text-5xl">
                          <span style={{ "--value": countdown.seconds }}></span>
                        </span>
                        sec
                      </div>
                    </div>
                  )}
                  <button
                    onClick={handleShare}
                    className={`flex sm:hidden items-center gap-2 p-2 px-4 rounded-full bg-white bg-opacity-10 hocus:bg-opacity-20 text-sm ml-auto`}
                  >
                    <IonIcon icon={arrowRedoOutline} />
                    <span>Share</span>
                  </button>

                  {/* <button
                    onClick={() => setIsActive(!isActive)}
                    className={`hidden sm:flex items-center gap-2 p-2 px-4 rounded-full bg-white bg-opacity-10 hocus:bg-opacity-20 text-sm`}
                  >
                    <IonIcon icon={arrowRedoOutline} />
                    <span>Share</span>
                  </button> */}

                  <button
                    className="hidden sm:flex items-center gap-2 rounded-full btn btn-ghost bg-white bg-opacity-10 hocus:bg-opacity-20 text-sm ml-auto"
                    onClick={() =>
                      document.getElementById("shareModal").showModal()
                    }
                  >
                    <IonIcon icon={arrowRedoOutline} />
                    <span>Share</span>
                  </button>

                  <dialog
                    id="shareModal"
                    className="modal backdrop:bg-black backdrop:bg-opacity-75 backdrop:backdrop-blur"
                  >
                    <div className="modal-box max-w-sm">
                      <h2 className={`text-center`}>Share to</h2>

                      <div
                        className={`mt-2 flex items-center justify-center gap-2 mb-4`}
                      >
                        <WhatsappShareButton url={URL}>
                          <WhatsappIcon size={50} round={true} />
                        </WhatsappShareButton>

                        <FacebookShareButton url={URL}>
                          <FacebookIcon size={50} round={true} />
                        </FacebookShareButton>

                        <TwitterShareButton url={URL}>
                          <TwitterIcon size={50} round={true} />
                        </TwitterShareButton>
                      </div>

                      <div
                        className={`flex flex-col sm:flex-row items-center gap-2 p-2 rounded-full bg-black bg-opacity-50 text-sm border border-white border-opacity-50 w-full`}
                      >
                        <input
                          type="text"
                          value={URL}
                          readOnly
                          className={`bg-transparent w-full`}
                        />
                        <button
                          onClick={handleCopy}
                          className={`text-black font-medium btn btn-primary btn-sm rounded-full`}
                        >
                          {copied ? `Copied!` : `Copy`}
                        </button>
                      </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                      <button>close</button>
                    </form>
                  </dialog>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div className="text-white flex flex-col gap-6">
          {film.overview && (
            <div id="overview" className="flex flex-col gap-2 ">
              <h2 className="font-bold text-xl text-white m-0">Overview</h2>

              <p className="text-gray-400 md:text-lg">{film.overview}</p>
            </div>
          )}

          {videos.results.length > 0 && images.backdrops.length > 0 && (
            <FilmMedia videos={videos} images={images.backdrops} />
          )}

          {!isTvPage ? (
            film.belongs_to_collection !== null && (
              <FilmCollection film={film} />
            )
          ) : (
            <FilmCollection film={film} />
          )}

          {reviews.results.length > 0 && (
            <FilmReviews reviews={reviews} film={film} />
          )}
        </div>
      </div>

      {/* <ShareModal isActive={isActive} setIsActive={setIsActive} /> */}
    </>
  );
}

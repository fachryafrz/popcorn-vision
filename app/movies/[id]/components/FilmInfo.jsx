/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
// React imports
import React, { useEffect, useState } from "react";
import axios from "axios";

// Ionic React icons
import { IonIcon } from "@ionic/react";
import {
  arrowRedoOutline,
  calendarOutline,
  star,
  timeOutline,
  tvOutline,
} from "ionicons/icons";

// Social media sharing components
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  PinterestIcon,
  PinterestShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

export default function FilmInfo({ film, credits, providers, isTvPage }) {
  const [location, setLocation] = useState(null);
  const [language, setLanguage] = useState("id-ID");
  const [userLocation, setUserLocation] = useState();
  const [copied, setCopied] = useState(false);
  const [URL, setURL] = useState("");
  const [episodes, setEpisodes] = useState([]);

  const formatDate = (dateValue) => {
    const dateStr = dateValue;
    const date = new Date(dateStr);
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    const formattedDate = date.toLocaleString("en-US", options);
    return formattedDate;
  };

  const fetchEpisodes = async () => {
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/tv/${film.id}/season/${film.number_of_seasons}`,
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

    if (isTvPage) {
      fetchEpisodes();
    }
  }, [location, film, isTvPage]);

  const nextEps = film.next_episode_to_air;
  const lastEps = film.last_episode_to_air;

  let providersArray = Object.entries(providers.results);
  let providersIDArray =
    userLocation &&
    providersArray.find((item) => item[0] === userLocation.countryCode);

  // Release Date
  const dateStr = !isTvPage ? film.release_date : film.first_air_date;
  const date =
    new Date(dateStr) > new Date()
      ? new Date(dateStr)
      : new Date(nextEps?.air_date);
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const formattedDate = new Date(dateStr).toLocaleString("en-US", options);

  // Countdown
  const timeLeft = new Date(date - new Date());
  // const daysRemaining = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const monthsLeft = timeLeft.getUTCMonth();
  const daysLeft = timeLeft.getUTCDay();
  const hoursLeft = timeLeft.getUTCHours();
  const minutesLeft = timeLeft.getUTCMinutes();
  const secondsLeft = timeLeft.getUTCSeconds();
  const [countdown, setCountdown] = useState({
    months: monthsLeft,
    days: daysLeft,
    hours: hoursLeft,
    minutes: minutesLeft,
    seconds: secondsLeft,
  });

  // Next Episode
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
  const releaseDayIndex = new Date(dateStr).getDay();
  const lastReleaseDayIndex = new Date(film.last_air_date).getDay();
  const releaseDay = dayNames[releaseDayIndex];
  const lastReleaseDay = dayNames[lastReleaseDayIndex];

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

  return (
    <div className={`w-full text-sm lg:text-base flex flex-col gap-4 md:gap-2`}>
      {film.production_companies && film.production_companies.length > 0 && (
        <section
          id={`Production Companies`}
          className={`flex lg:hidden gap-4 flex-wrap justify-center md:justify-start`}
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
                    className={`object-contain w-[150px] h-[50px] inline grayscale invert hover:grayscale-0 hover:invert-0 transition-all`}
                  />
                  <span className={`sr-only`} itemProp="name">
                    {item.name}
                  </span>
                </div>
              )
          )}
        </section>
      )}

      {!isTvPage
        ? film.release_date && (
            <section id={`Movie Release Date`}>
              <meta itemProp="datePublished" content={film.release_date} />
              <div className={`flex items-center gap-2`}>
                <IonIcon icon={calendarOutline} />

                <time dateTime={film.release_date}>
                  {`${releaseDay}, ${formattedDate}`}
                </time>
              </div>
            </section>
          )
        : film.first_air_date && (
            <section id={`TV Series Air Date`}>
              <meta itemProp="datePublished" content={film.first_air_date} />
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
            </section>
          )}

      {isTvPage &&
        film.number_of_seasons > 0 &&
        film.number_of_episodes > 0 && (
          <section
            id={`TV Series Chapter`}
            className={`flex items-center gap-2`}
          >
            <IonIcon icon={tvOutline} />

            <span>
              {`${film.number_of_seasons} Season${
                film.number_of_seasons > 1 ? `s` : ``
              }`}{" "}
              {`(${film.number_of_episodes} Episode${
                film.number_of_episodes > 1 ? `s` : ``
              })`}
            </span>
          </section>
        )}

      {!isTvPage
        ? film.runtime > 0 && (
            <section id={`Movie Runtime`}>
              {Math.floor(film.runtime / 60) >= 1 ? (
                <>
                  <meta itemProp="duration" content={`PT${film.runtime}M`} />
                  <div className={`flex items-center gap-2`}>
                    <IonIcon icon={timeOutline} />
                    <time>{film.runtime} minutes</time>
                    <time>
                      ({Math.floor(film.runtime / 60)}h {film.runtime % 60}m)
                    </time>
                  </div>
                </>
              ) : (
                <>
                  <meta itemProp="duration" content={`PT${film.runtime}M`} />
                  <div className={`flex items-center gap-2`}>
                    <IonIcon icon={timeOutline} />

                    <time>
                      {film.runtime % 60} minute
                      {film.runtime % 60 > 1 && `s`}
                    </time>
                  </div>
                </>
              )}
            </section>
          )
        : film.episode_run_time.length > 0 && (
            <section id={`TV Series Average Episode Runtime`}>
              {Math.floor(film.episode_run_time[0] / 60) >= 1 ? (
                <>
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
                </>
              ) : (
                <>
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
                </>
              )}
            </section>
          )}

      {film.genres && film.genres.length > 0 && (
        <section id={`Film Genres`} className={`gap-1 flex flex-wrap`}>
          {/* <td>{film.genres.map((item) => item.name).join(", ")}</td> */}

          {film.genres.map((item) => {
            return (
              <span
                key={item.id}
                className={`btn btn-ghost bg-secondary bg-opacity-20 rounded-full backdrop-blur`}
                itemProp="genre"
              >
                {item.name}
              </span>
            );
          })}
        </section>
      )}

      {!isTvPage
        ? credits &&
          credits.crew.length > 0 &&
          credits.crew.find((person) => person.job === "Director") && (
            <section
              id={`Movie Director`}
              className={`flex items-center gap-2`}
            >
              {credits.crew.find((person) => person.job === "Director")
                .profile_path === null ? (
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
                      credits.crew.find((person) => person.job === "Director")
                        .profile_path
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
                    credits.crew.find((person) => person.job === "Director")
                      .name
                  }
                </span>
                <span className="text-sm text-gray-400 ">
                  {credits.crew.find((person) => person.job === "Director").job}
                </span>
              </div>
            </section>
          )
        : film.created_by.length > 0 && (
            <section
              id={`TV Series Creator`}
              className={`flex flex-wrap items-center gap-2`}
            >
              {film.created_by.map((item, index) => {
                return (
                  <div key={index} className={`flex items-center gap-2`}>
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
                      <span className="font-medium h-7" itemProp="name">
                        {item.name}
                      </span>
                      <span className="text-sm text-gray-400 ">
                        {`Creator`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </section>
          )}

      {providers.results && providersIDArray ? (
        <section
          id={`Film Providers`}
          className="flex flex-col gap-1 justify-center md:justify-start"
        >
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
        </section>
      ) : location ? (
        providersIDArray && (
          <section id={`Film Providers`}>
            <span className={`text-gray-400 text-sm italic`}>
              Where to watch? <br /> Hold on we&apos;re still finding...
            </span>
          </section>
        )
      ) : (
        <section id={`Film Providers`}>
          <span className={`text-gray-400 text-sm italic`}>
            Where to watch? <br /> Please enable location services to find out
            where to watch this film.
          </span>
        </section>
      )}

      {lastEps && (
        <section
          id={`TV Series Last Episode`}
          className={`flex flex-col gap-1 mt-2`}
        >
          <span>
            {nextEps ? `Latest` : `Last`}
            {` Episode: Episode ${lastEps.episode_number}`}
          </span>
          <div
            id={`card`}
            className={`flex flex-col sm:flex-row gap-3 p-2 rounded-xl backdrop-blur bg-secondary bg-opacity-10 w-full xl`}
          >
            <figure
              className={`aspect-video bg-base-100 rounded-lg w-full sm:w-[150px] overflow-hidden`}
            >
              {lastEps.still_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${lastEps.still_path}`}
                  alt={lastEps.name}
                />
              ) : (
                <img
                  src={`/popcorn.png`}
                  alt={lastEps.name}
                  className={`pointer-events-none mx-auto object-contain`}
                />
              )}
            </figure>
            <div className={`flex flex-col justify-center`}>
              <span className={`font-medium line-clamp-2`}>{lastEps.name}</span>

              <span
                className={`text-xs sm:text-sm text-gray-400 font-medium line-clamp-1 mb-1`}
              >{`Season ${lastEps.season_number}`}</span>

              <div
                className={`flex items-center gap-1 text-xs sm:text-sm text-gray-400 font-medium`}
              >
                {lastEps.vote_average > 1 && (
                  <span className={`flex items-center gap-1`}>
                    <IonIcon icon={star} className={`text-primary-yellow`} />
                    {lastEps.vote_average && lastEps.vote_average.toFixed(1)}
                  </span>
                )}

                {lastEps.vote_average > 1 && lastEps.air_date && (
                  <span>&bull;</span>
                )}

                {lastEps.runtime && (
                  <span>
                    {Math.floor(lastEps.runtime / 60) >= 1
                      ? `${Math.floor(lastEps.runtime / 60)}h ${Math.floor(
                          lastEps.runtime % 60
                        )}m`
                      : `${lastEps.runtime} minute${
                          lastEps.runtime % 60 > 1 && `s`
                        }`}
                  </span>
                )}

                {lastEps.air_date && lastEps.runtime && <span>&bull;</span>}

                {lastEps.air_date && (
                  <span>{formatDate(lastEps.air_date)}</span>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <section
        id={`Share`}
        className={`relative flex flex-col items-center sm:items-start justify-between gap-4 sm:gap-0`}
      >
        {isUpcoming && (
          <div className={`w-full flex flex-col items-start gap-2`}>
            {!isTvPage ? (
              <span>{`Released in`}</span>
            ) : (
              <span>
                {nextEps.episode_type == `finale`
                  ? `Final episode: ${nextEps.name}`
                  : nextEps.episode_number == 1
                  ? `First episode`
                  : `Next episode: Episode ${nextEps.episode_number}`}
              </span>
            )}

            {nextEps && (
              <div
                id={`card`}
                className={`flex flex-col sm:flex-row gap-3 p-2 rounded-xl backdrop-blur bg-secondary bg-opacity-10 w-full mb-2`}
              >
                <figure
                  className={`aspect-video bg-base-100 rounded-lg w-full sm:w-[150px] overflow-hidden`}
                >
                  {nextEps.still_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${nextEps.still_path}`}
                      alt={nextEps.name}
                    />
                  ) : (
                    <img
                      src={`/popcorn.png`}
                      alt={nextEps.name}
                      className={`pointer-events-none mx-auto object-contain`}
                    />
                  )}
                </figure>
                <div className={`flex flex-col justify-center`}>
                  <span className={`font-medium line-clamp-2`}>
                    {nextEps.name}
                  </span>

                  <span
                    className={`text-xs sm:text-sm text-gray-400 font-medium line-clamp-1 mb-1`}
                  >{`Season ${nextEps.season_number}`}</span>

                  <div
                    className={`flex items-center gap-1 text-xs sm:text-sm text-gray-400 font-medium`}
                  >
                    {nextEps.vote_average > 1 && (
                      <span className={`flex items-center gap-1`}>
                        <IonIcon
                          icon={star}
                          className={`text-primary-yellow`}
                        />
                        {nextEps.vote_average &&
                          nextEps.vote_average.toFixed(1)}
                      </span>
                    )}

                    {nextEps.vote_average > 1 && nextEps.air_date && (
                      <span>&bull;</span>
                    )}

                    {nextEps.runtime && (
                      <span>
                        {Math.floor(nextEps.runtime / 60) >= 1
                          ? `${Math.floor(nextEps.runtime / 60)}h ${Math.floor(
                              nextEps.runtime % 60
                            )}m`
                          : `${nextEps.runtime} minute${
                              nextEps.runtime % 60 > 1 && `s`
                            }`}
                      </span>
                    )}

                    {nextEps.air_date && nextEps.runtime && <span>&bull;</span>}

                    {nextEps.air_date && (
                      <span>{formatDate(nextEps.air_date)}</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-2 text-center">
              {countdown.months > 0 && (
                <div className="flex flex-col p-2 bg-secondary bg-opacity-10 backdrop-blur-sm rounded-xl text-neutral-content">
                  <span className="countdown font-mono text-5xl">
                    <span style={{ "--value": countdown.months }}></span>
                  </span>
                  month{countdown.months > 1 ? `s` : ``}
                </div>
              )}
              {countdown.days > 0 && (
                <div className="flex flex-col p-2 bg-secondary bg-opacity-10 backdrop-blur-sm rounded-xl text-neutral-content">
                  <span className="countdown font-mono text-5xl">
                    <span style={{ "--value": countdown.days }}></span>
                  </span>
                  day{countdown.days > 1 ? `s` : ``}
                </div>
              )}
              <div className="flex flex-col p-2 bg-secondary bg-opacity-10 backdrop-blur-sm rounded-xl text-neutral-content">
                <span className="countdown font-mono text-5xl">
                  <span style={{ "--value": countdown.hours }}></span>
                </span>
                hour{countdown.hours > 1 ? `s` : ``}
              </div>
              <div className="flex flex-col p-2 bg-secondary bg-opacity-10 backdrop-blur-sm rounded-xl text-neutral-content">
                <span className="countdown font-mono text-5xl">
                  <span style={{ "--value": countdown.minutes }}></span>
                </span>
                min
              </div>
              <div className="flex flex-col p-2 bg-secondary bg-opacity-10 backdrop-blur-sm rounded-xl text-neutral-content">
                <span className="countdown font-mono text-5xl">
                  <span style={{ "--value": countdown.seconds }}></span>
                </span>
                sec
              </div>
            </div>
          </div>
        )}
        <button
          onClick={handleShare}
          className={`sm:hidden flex items-center gap-2 rounded-full btn btn-ghost bg-white bg-opacity-5 text-sm ml-auto mt-2`}
        >
          <IonIcon icon={arrowRedoOutline} />
          <span>Share</span>
        </button>

        <button
          className={`hidden sm:flex items-center gap-2 rounded-full btn btn-ghost bg-white bg-opacity-5 text-sm ml-auto mt-2`}
          onClick={() => document.getElementById("shareModal").showModal()}
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

            <div className={`mt-2 flex flex-wrap justify-center gap-2 mb-4`}>
              <WhatsappShareButton url={URL}>
                <WhatsappIcon size={50} round={true} />
              </WhatsappShareButton>

              <FacebookShareButton url={URL}>
                <FacebookIcon size={50} round={true} />
              </FacebookShareButton>

              <TwitterShareButton url={URL}>
                <TwitterIcon size={50} round={true} />
              </TwitterShareButton>

              <LinkedinShareButton url={URL}>
                <LinkedinIcon size={50} round={true} />
              </LinkedinShareButton>

              <PinterestShareButton url={URL}>
                <PinterestIcon size={50} round={true} />
              </PinterestShareButton>

              <RedditShareButton url={URL}>
                <RedditIcon size={50} round={true} />
              </RedditShareButton>

              <TelegramShareButton url={URL}>
                <TelegramIcon size={50} round={true} />
              </TelegramShareButton>

              <EmailShareButton url={URL}>
                <EmailIcon size={50} round={true} />
              </EmailShareButton>
            </div>

            <div className="divider">or</div>

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
      </section>
    </div>
  );
}

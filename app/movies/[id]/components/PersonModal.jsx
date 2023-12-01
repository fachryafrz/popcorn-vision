/* eslint-disable @next/next/no-img-element */
import FilmSlider from "@/app/components/FilmSlider";
import { IonIcon } from "@ionic/react";
import axios from "axios";
import {
  briefcaseOutline,
  calendarOutline,
  chevronBack,
  chevronForward,
  close,
  filmOutline,
  locationOutline,
} from "ionicons/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

export default function PersonModal({
  person,
  setSelectedPerson,
  loading,
  episode,
}) {
  // Format Date
  const dateStr = person.birthday;
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
  const birthdayIndex = new Date(dateStr).getDay();
  const deathdayIndex = new Date(person.deathday).getDay();
  const birthday = dayNames[birthdayIndex];
  const deathday = dayNames[deathdayIndex];

  const [combinedCredits, setCombinedCredits] = useState();
  const [movieCredits, setMovieCredits] = useState();
  const [tvCredits, setTVCredits] = useState();
  const [images, setImages] = useState();
  const [creditsSwitcher, setCreditsSwitcher] = useState(`Movies`);
  const [films, setFilms] = useState();

  useEffect(() => {
    const fetchCombinedCredits = async () => {
      try {
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/person/${person.id}/combined_credits`,
          {
            params: {
              api_key: "84aa2a7d5e4394ded7195035a4745dbd",
            },
          }
        );
        setCombinedCredits(data);
      } catch (error) {
        console.error(`Errornya combined credits: ${error}`);
      }
    };
    const fetchMovieCredits = async () => {
      try {
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/person/${person.id}/movie_credits`,
          {
            params: {
              api_key: "84aa2a7d5e4394ded7195035a4745dbd",
            },
          }
        );
        setMovieCredits(data);
        setFilms(data);
      } catch (error) {
        console.error(`Errornya movie credits: ${error}`);
      }
    };
    const fetchTVCredits = async () => {
      try {
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/person/${person.id}/tv_credits`,
          {
            params: {
              api_key: "84aa2a7d5e4394ded7195035a4745dbd",
            },
          }
        );
        setTVCredits(data);
      } catch (error) {
        console.error(`Errornya tv credits: ${error}`);
      }
    };
    const fetchImages = async () => {
      try {
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/person/${person.id}/images`,
          {
            params: {
              api_key: "84aa2a7d5e4394ded7195035a4745dbd",
            },
          }
        );
        setImages(data);
      } catch (error) {
        console.error(`Errornya person images: ${error}`);
      }
    };

    fetchCombinedCredits();
    fetchMovieCredits();
    fetchTVCredits();
    fetchImages();
  }, [person]);

  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");

  useEffect(() => {
    if (creditsSwitcher === `TV`) {
      setFilms(tvCredits);
    } else if (creditsSwitcher === `Movies`) {
      setFilms(movieCredits);
    }
  }, [creditsSwitcher]);

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

  const calculateAge = (birthdate) => {
    let today = new Date();
    let birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    let monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  return (
    <dialog
      id={`personModal`}
      className={`modal backdrop:bg-black backdrop:bg-opacity-75 backdrop:backdrop-blur overflow-y-auto`}
    >
      <div className={`pt-4 px-4 sm:pt-16 relative w-full max-w-7xl`}>
        <div className={`pointer-events-none absolute inset-0`}>
          <button
            onClick={() => {
              document.getElementById(`personModal`).close();
              if (episode) {
                document.getElementById(`episodeModal`).showModal();
              }
              setTimeout(() => {
                setSelectedPerson(null);
              }, 100);
            }}
            className={`grid place-content-center aspect-square sticky top-0 ml-auto z-50 p-4 mr-4 pointer-events-auto`}
          >
            <IonIcon icon={close} className={`text-3xl`} />
          </button>
        </div>

        <div
          className={`modal-box max-w-none w-full p-4 max-h-none grid grid-cols-12 gap-4 rounded-t-[2rem] rounded-b-none`}
          style={{ overflowY: `unset` }}
        >
          {/* Person Profile */}
          <section className={`col-span-12 md:col-span-4 lg:col-span-3`}>
            <div
              className={`bg-secondary bg-opacity-10 rounded-2xl overflow-hidden sticky top-4 sm:flex sm:items-center md:block`}
            >
              {/* Profile Picture */}
              <figure
                className={`aspect-poster sm:flex-1`}
                style={{
                  backgroundImage:
                    person.profile_path === null
                      ? `url(/popcorn.png)`
                      : `url(https://image.tmdb.org/t/p/h632${person.profile_path})`,
                  backgroundSize:
                    person.profile_path === null ? `contain` : `cover`,
                  backgroundRepeat: `no-repeat`,
                  backgroundPosition: `center`,
                }}
              ></figure>

              {/* Person Info */}
              <div className={`p-4 pb-6 flex flex-col gap-4`}>
                <h2
                  className={`text-xl md:text-3xl md:text-center font-bold md:mb-2`}
                  style={{ textWrap: `balance` }}
                >
                  {person.name}
                </h2>

                {person.deathday && (
                  <div className={`flex flex-col`}>
                    <section id={`Born Date`}>
                      <div className={`flex items-center gap-2`}>
                        <span className={`text-gray-400 italic font-medium`}>
                          Born:
                        </span>

                        <time dateTime={person.birthday}>
                          {`${birthday}, ${formattedDate}`}
                        </time>
                      </div>
                    </section>

                    <section id={`Death Date`}>
                      <div className={`flex items-center gap-2`}>
                        <span className={`text-gray-400 italic font-medium`}>
                          Death:
                        </span>

                        <time dateTime={person.deathday}>
                          {`${deathday}, ${new Date(
                            person.deathday
                          ).toLocaleString("en-US", options)}`}
                        </time>
                      </div>
                    </section>
                  </div>
                )}

                <div className={`flex flex-col gap-1`}>
                  {!person.deathday && (
                    <section id={`Birth Date`}>
                      <div className={`flex items-center gap-2`}>
                        <IonIcon icon={calendarOutline} />

                        <time dateTime={person.birthday}>
                          {`${birthday}, ${formattedDate}`}
                        </time>
                      </div>
                    </section>
                  )}

                  {person.place_of_birth && (
                    <section id={`Place of Birth`}>
                      <div className={`flex items-center gap-2`}>
                        <IonIcon icon={locationOutline} />
                        <span
                          title={person.place_of_birth}
                          className={`line-clamp-1`}
                        >
                          {person.place_of_birth}
                        </span>
                      </div>
                    </section>
                  )}

                  {person.known_for_department && (
                    <section id={`Known For`}>
                      <div className={`flex items-center gap-2`}>
                        <IonIcon icon={briefcaseOutline} />
                        <span>{person.known_for_department}</span>
                      </div>
                    </section>
                  )}

                  {combinedCredits?.cast.length > 0 && (
                    <section id={`Films`}>
                      <div className={`flex items-center gap-2`}>
                        <IonIcon icon={filmOutline} />
                        <span>{`${combinedCredits?.cast.length} Film${
                          combinedCredits?.cast.length > 1 ? `s` : ``
                        }`}</span>
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Person Details */}
          <section className={`col-span-12 md:col-span-8 lg:col-span-9`}>
            <div className={`flex flex-col gap-4 sticky top-4`}>
              {/* Images */}
              {images?.profiles.length - 1 > 0 && (
                <section className={`flex items-end gap-1`}>
                  <Swiper
                    modules={[Navigation]}
                    spaceBetween={8}
                    slidesPerView={2}
                    // loop={true}
                    navigation={{
                      nextEl: ".next",
                      prevEl: ".prev",
                      clickable: true,
                    }}
                    breakpoints={{
                      768: {
                        slidesPerView: 3,
                      },
                      1024: {
                        slidesPerView: 4,
                      },
                    }}
                    className={`!pt-[2.5rem] relative w-full`}
                    wrapperClass={`rounded-xl`}
                  >
                    {images?.profiles
                      .slice(1, images.profiles.length)
                      .map((image, i) => {
                        return (
                          <SwiperSlide
                            key={image.id}
                            className={`transition-all`}
                          >
                            <figure
                              className={`aspect-poster rounded-xl`}
                              style={{
                                backgroundImage: `url(https://image.tmdb.org/t/p/h632${image.file_path})`,
                                backgroundSize: `contain`,
                                backgroundRepeat: `no-repeat`,
                                backgroundPosition: `center`,
                              }}
                            ></figure>
                          </SwiperSlide>
                        );
                      })}

                    <div className="z-20 absolute top-0 left-0 right-0 h-[28px] max-w-7xl xl:max-w-none flex justify-between items-end">
                      <div className="flex gap-2 items-end">
                        <h3 className={`text-2xl font-bold`}>Images</h3>
                        <span
                          className={`block text-base font-normal text-gray-400`}
                        >
                          (
                          {`${images?.profiles.length - 1} photo${
                            images?.profiles.length - 1 > 1 ? `s` : ``
                          }`}
                          )
                        </span>
                      </div>

                      <div className={`flex gap-4 items-center`}>
                        <button
                          className="prev h-[1.5rem]"
                          aria-label="Move slider left"
                        >
                          <IonIcon
                            icon={chevronBack}
                            className="text-[1.5rem]"
                          ></IonIcon>
                        </button>
                        <button
                          className="next h-[1.5rem]"
                          aria-label="Move slider right"
                        >
                          <IonIcon
                            icon={chevronForward}
                            className="text-[1.5rem]"
                          ></IonIcon>
                        </button>
                      </div>
                    </div>
                  </Swiper>
                </section>
              )}

              {/* Stats */}
              <section className={`flex gap-12 flex-wrap`}>
                <div id={`Age`} className={`flex flex-col gap-1`}>
                  <span className={`text-xl font-bold`}>
                    {`${calculateAge(person.birthday)} years`}
                  </span>
                  <span className={`text-gray-400`}>Age</span>
                </div>

                {movieCredits?.cast.length > 0 && (
                  <div id={`Movies`} className={`flex flex-col gap-1`}>
                    <span className={`text-xl font-bold`}>
                      {movieCredits?.cast.length}
                    </span>
                    <span className={`text-gray-400`}>Movies</span>
                  </div>
                )}

                {tvCredits?.cast.length > 0 && (
                  <div id={`TV Series`} className={`flex flex-col gap-1`}>
                    <span className={`text-xl font-bold`}>
                      {tvCredits?.cast.length}
                    </span>
                    <span className={`text-gray-400`}>TV Series</span>
                  </div>
                )}
              </section>

              {/* Biography */}
              {person.biography && (
                <section
                  className={`flex flex-col gap-2 border-t border-t-white border-opacity-10 pt-2`}
                >
                  <h3 className={`text-2xl font-bold`}>Biography</h3>

                  <div
                    className={`prose max-w-none [&_*]:!text-gray-400 text-sm sm:text-base`}
                    itemProp="reviewBody"
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {person.biography}
                    </ReactMarkdown>
                  </div>
                </section>
              )}
            </div>
          </section>

          {/* Person Works */}
          {films?.cast.length > 0 && (
            <section
              className={`col-span-12 border-t border-t-white border-opacity-10 pt-4`}
            >
              <div>
                <section id={`Movies & TV Series`}>
                  <h2 className="sr-only">{`Movies & TV Series`}</h2>

                  <Swiper
                    modules={[Navigation]}
                    spaceBetween={8}
                    slidesPerView={2}
                    // loop={true}
                    navigation={{
                      nextEl: ".next",
                      prevEl: ".prev",
                      clickable: true,
                    }}
                    breakpoints={{
                      640: {
                        slidesPerView: 3,
                        slidesPerGroup: 3,
                      },
                      768: {
                        slidesPerView: 4,
                        slidesPerGroup: 4,
                      },
                      1024: {
                        slidesPerView: 5,
                        slidesPerGroup: 5,
                      },
                    }}
                    className={`!pb-4 !pt-[2.5rem] max-w-7xl !-mx-2 !px-2`}
                  >
                    {films?.cast
                      .filter(
                        (item, index, self) =>
                          index === self.findIndex((t) => t.id === item.id)
                      )
                      .map((film) => {
                        let popcorn = `url(/popcorn.png)`;
                        let filmPoster = `url(https://image.tmdb.org/t/p/w300${film.poster_path})`;

                        return (
                          <SwiperSlide
                            key={film.id}
                            className={`overflow-hidden hocus:scale-[1.025] active:scale-100 transition-all max-w-[50vw] sm:max-w-[33.3vw] md:max-w-[25vw] lg:max-w-[20vw]`}
                          >
                            <article>
                              <Link
                                href={`/${
                                  creditsSwitcher === `Movies` ? `movies` : `tv`
                                }/${film.id}-${slugify(
                                  creditsSwitcher === `Movies`
                                    ? film.title
                                    : film.name
                                )}`}
                              >
                                <figure
                                  className={`rounded-lg overflow-hidden aspect-poster relative`}
                                  style={{
                                    backgroundImage:
                                      film.poster_path === null
                                        ? popcorn
                                        : filmPoster,
                                    backgroundSize:
                                      film.poster_path === null
                                        ? `contain`
                                        : `cover`,
                                    backgroundRepeat: `no-repeat`,
                                    backgroundPosition: `center`,
                                  }}
                                >
                                  {film.vote_average > 0 && (
                                    <div
                                      className={`absolute top-0 left-0 m-2 p-1 bg-base-100 bg-opacity-50 backdrop-blur-sm rounded-full`}
                                    >
                                      <div
                                        className={`radial-progress text-sm font-semibold ${
                                          film.vote_average > 0 &&
                                          film.vote_average < 3
                                            ? `text-primary-red`
                                            : film.vote_average >= 3 &&
                                              film.vote_average < 7
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
                              </Link>
                            </article>
                          </SwiperSlide>
                        );
                      })}

                    <div className="z-20 absolute top-0 left-0 right-0 h-[28px] px-2 max-w-7xl xl:max-w-none flex justify-between items-end">
                      <div className="flex gap-4 items-end">
                        {movieCredits?.cast.length > 0 && (
                          <button
                            onClick={() => setCreditsSwitcher(`Movies`)}
                            className={`font-bold transition-all text-lg sm:text-2xl hocus:text-gray-500 ${
                              creditsSwitcher === `Movies`
                                ? `text-white hocus:text-white`
                                : `text-gray-600`
                            }`}
                          >
                            Movies
                          </button>
                        )}

                        {tvCredits?.cast.length > 0 && (
                          <button
                            onClick={() => setCreditsSwitcher(`TV`)}
                            className={`font-bold transition-all text-lg sm:text-2xl hocus:text-gray-500 ${
                              creditsSwitcher === `TV`
                                ? `text-white hocus:text-white`
                                : `text-gray-600`
                            }`}
                          >
                            TV Series
                          </button>
                        )}
                      </div>

                      <div className={`flex gap-4 items-center`}>
                        <button
                          className="prev h-[1.5rem]"
                          aria-label="Move slider left"
                        >
                          <IonIcon
                            icon={chevronBack}
                            className="text-[1.5rem]"
                          ></IonIcon>
                        </button>
                        <button
                          className="next h-[1.5rem]"
                          aria-label="Move slider right"
                        >
                          <IonIcon
                            icon={chevronForward}
                            className="text-[1.5rem]"
                          ></IonIcon>
                        </button>
                      </div>
                    </div>
                  </Swiper>
                </section>
              </div>
            </section>
          )}
        </div>
      </div>
    </dialog>
  );
}

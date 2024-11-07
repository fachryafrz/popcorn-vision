/* eslint-disable @next/next/no-img-element */
"use client";

import { isPlural } from "@/lib/isPlural";
import { IonIcon } from "@ionic/react";
import { chevronBack, chevronForward } from "ionicons/icons";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function PersonDetails({
  person,
  images,
  movieCredits,
  tvCredits,
  isModal = false,
}) {
  const personJob = person.known_for_department;
  const personMovies =
    personJob === "Acting" ? movieCredits?.cast : movieCredits?.crew;
  const personTV = personJob === "Acting" ? tvCredits?.cast : tvCredits?.crew;

  const calculateAge = (birthdate, deathdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    const endDate = deathdate ? new Date(deathdate) : today;

    let age = endDate.getFullYear() - birthDate.getFullYear();
    const monthDifference = endDate.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && endDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  return (
    <div
      className={`flex flex-col gap-4 ${
        isModal ? `sticky top-4` : `sticky top-20`
      }`}
    >
      {/* Images */}
      {images?.profiles.length - 1 > 0 && (
        <section className={`flex items-end gap-1`}>
          <Swiper
            modules={[Navigation]}
            spaceBetween={8}
            slidesPerView={"auto"}
            // loop={true}
            navigation={{
              nextEl: ".next",
              prevEl: ".prev",
              clickable: true,
            }}
            className={`relative w-full !pt-[2.5rem]`}
            wrapperClass={`rounded-xl`}
          >
            {images?.profiles
              .slice(1, images.profiles.length)
              .map((image, i) => {
                return (
                  <SwiperSlide
                    key={image.id}
                    className={`max-w-[calc(100%/2.5)] transition-all sm:max-w-[calc(100%/3.5)] lg:max-w-[calc(100%/4.5)]`}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w500${image.file_path}`}
                      draggable={false}
                      loading="lazy"
                      role="presentation"
                      alt={person.name}
                      className={`aspect-poster rounded-xl`}
                    />
                  </SwiperSlide>
                );
              })}

            <div className="absolute left-0 right-0 top-0 z-20 flex h-[28px] max-w-7xl items-end justify-between xl:max-w-none">
              <div className="flex items-end gap-2">
                <h3 className={`text-2xl font-bold`}>Images</h3>
                <span className={`block text-base font-normal text-gray-400`}>
                  (
                  {`${images?.profiles.length - 1} ${isPlural({
                    text: "photo",
                    number: images?.profiles.length - 1,
                  })}`}
                  )
                </span>
              </div>

              <div className={`flex items-center gap-4`}>
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
      <section className={`flex flex-wrap gap-12`}>
        {person.birthday && (
          <div id={`Age`} className={`flex flex-col gap-1`}>
            <span className={`text-xl font-bold`}>
              {`${calculateAge(person.birthday, person.deathday)} years`}
            </span>
            <span className={`text-gray-400`}>Age</span>
          </div>
        )}

        {personMovies.length > 0 && (
          <div id={`Movies`} className={`flex flex-col gap-1`}>
            <span className={`text-xl font-bold`}>{personMovies.length}</span>
            <span className={`text-gray-400`}>Movies</span>
          </div>
        )}

        {personTV.length > 0 && (
          <div id={`TV Series`} className={`flex flex-col gap-1`}>
            <span className={`text-xl font-bold`}>{personTV.length}</span>
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
            className={`prose max-w-none text-sm sm:text-base [&_*]:!text-gray-400`}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {person.biography}
            </ReactMarkdown>
          </div>
        </section>
      )}
    </div>
  );
}

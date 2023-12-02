"use client";

import { IonIcon } from "@ionic/react";
import { chevronBack, chevronForward } from "ionicons/icons";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

export default function PersonDetails({
  person,
  images,
  movieCredits,
  tvCredits,
  isModal = false,
}) {
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
            className={`!pt-[2.5rem] relative w-full`}
            wrapperClass={`rounded-xl`}
          >
            {images?.profiles
              .slice(1, images.profiles.length)
              .map((image, i) => {
                return (
                  <SwiperSlide
                    key={image.id}
                    className={`transition-all max-w-[50vw] sm:max-w-[33.3vw] md:max-w-[25vw] lg:max-w-[15vw]`}
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
                <span className={`block text-base font-normal text-gray-400`}>
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
  );
}

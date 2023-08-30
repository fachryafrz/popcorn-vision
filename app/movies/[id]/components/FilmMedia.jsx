/* eslint-disable @next/next/no-img-element */
import { IonIcon } from "@ionic/react";
import { chevronBack, chevronForward } from "ionicons/icons";
import React from "react";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  EffectFade,
  FreeMode,
  Mousewheel,
  Navigation,
  Thumbs,
  Zoom,
} from "swiper";

// Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/autoplay";
import "swiper/css/zoom";
import Image from "next/image";

export default function FilmMedia({ videos, images }) {
  const filteredVideos =
    videos &&
    videos.results.filter(
      (result) =>
        (result.site === "YouTube" &&
          result.official === true &&
          result.iso_639_1 === "en" &&
          result.type === "Trailer") ||
        result.type === "Teaser" ||
        result.type === "Clip"
    );

  return (
    <div className="flex flex-col gap-2 ">
      <div className="max-w-full">
        <Swiper
          modules={[
            FreeMode,
            Navigation,
            Thumbs,
            Autoplay,
            EffectFade,
            Mousewheel,
            Zoom,
          ]}
          // zoom={true}
          effect="fade"
          spaceBetween={16}
          // mousewheel={true}
          navigation={{
            enabled: true,
            nextEl: "#next",
            prevEl: "#prev",
          }}
          // autoplay={{
          //   delay: 3000,
          //   disableOnInteraction: true,
          //   pauseOnMouseEnter: true,
          // }}
          style={{
            "--swiper-navigation-color": "#fff",
            "--swiper-pagination-color": "#fff",
          }}
          className="relative aspect-video rounded-lg overflow-hidden"
        >
          <div
            id="navigation"
            className={`flex justify-between absolute inset-0 items-center flex-row-reverse px-4`}
          >
            <button
              id="next"
              className={`z-40 grid place-items-center shadow rounded-full bg-white text-base-dark-gray p-1`}
            >
              <IonIcon icon={chevronForward} className={`text-[1.25rem]`} />
            </button>
            <button
              id="prev"
              className={`z-40 grid place-items-center shadow rounded-full bg-white text-base-dark-gray p-1`}
            >
              <IonIcon icon={chevronBack} className={`text-[1.25rem]`} />
            </button>
          </div>
          {filteredVideos
            .reverse()
            .slice(0, 5)
            .map((vid, index) => {
              return (
                <SwiperSlide key={index}>
                  <iframe
                    src={`https://youtube.com/embed/${vid.key}?rel=0&start=0`}
                    title="YouTube video player"
                    loading="lazy"
                    frameBorder="0"
                    allowFullScreen
                    className={`w-full h-full`}
                  ></iframe>
                </SwiperSlide>
              );
            })}

          {images.map((img, index) => {
            return (
              <SwiperSlide key={index}>
                <figure className="swiper-zoom-container">
                  <Image
                    loading="lazy"
                    src={`https://image.tmdb.org/t/p/w780${img.file_path}`}
                    alt={``}
                    className={`w-full h-full object-cover`}
                    width={780}
                    height={780}
                  />
                </figure>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}

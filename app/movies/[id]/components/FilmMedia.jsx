/* eslint-disable @next/next/no-img-element */
import { IonIcon } from "@ionic/react";
import {
  chevronBack,
  chevronBackCircle,
  chevronForward,
  chevronForwardCircle,
} from "ionicons/icons";
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
    <div className="flex flex-col gap-2">
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
            className={`flex justify-between absolute inset-0 items-center flex-row-reverse`}
          >
            <button
              id="next"
              className={`z-40 flex items-center text-white p-2`}
            >
              <IonIcon icon={chevronForwardCircle} className={`text-3xl`} />
            </button>
            <button
              id="prev"
              className={`z-40 flex items-center text-white p-2`}
            >
              <IonIcon icon={chevronBackCircle} className={`text-3xl`} />
            </button>
          </div>
          {filteredVideos
            .reverse()
            .slice(0, 10)
            .map((vid, index) => {
              return (
                <SwiperSlide
                  key={index}
                  itemProp="trailer"
                  itemScope
                  itemType="http://schema.org/VideoObject"
                >
                  <link
                    itemProp="embedUrl"
                    href={`https://youtube.com/embed/${vid.key}?rel=0&start=0`}
                  />
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

          {images.slice(0, 10).map((img, index) => {
            return (
              <SwiperSlide key={index}>
                <figure className="swiper-zoom-container">
                  <img
                    loading="lazy"
                    src={`https://image.tmdb.org/t/p/w780${img.file_path}`}
                    alt={``}
                    className={`w-full h-full object-cover`}
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

"use client";

/* eslint-disable @next/next/no-img-element */
import { IonIcon } from "@ionic/react";
import { chevronBackCircle, chevronForwardCircle } from "ionicons/icons";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

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
} from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/autoplay";
import "swiper/css/zoom";

export default function FilmMedia({ videos, images }) {
  const filteredVideos = videos?.results.filter((result) => {
    const isYouTubeOfficial =
      result.site === "YouTube" && result.official === true;
    const isEnglish = result.iso_639_1 === "en";
    const isValidType = ["Trailer", "Teaser", "Clip"].includes(result.type);

    return isYouTubeOfficial && isEnglish && isValidType;
  });

  return (
    <div id="media" className="-mx-4 flex flex-col gap-2 md:mx-0">
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
          effect="fade"
          spaceBetween={16}
          navigation={{
            enabled: true,
            nextEl: "#next",
            prevEl: "#prev",
          }}
          style={{
            "--swiper-navigation-color": "#fff",
            "--swiper-pagination-color": "#fff",
          }}
          className="relative aspect-video overflow-hidden md:rounded-xl"
        >
          <div
            id="navigation"
            className={`absolute inset-0 flex flex-row-reverse items-center justify-between`}
          >
            <button
              id="next"
              className={`z-40 flex items-center p-2 text-white`}
              aria-labelledby={`next-slide`}
            >
              <IonIcon icon={chevronForwardCircle} className={`text-3xl`} />
            </button>
            <button
              id="prev"
              className={`z-40 flex items-center p-2 text-white`}
              aria-labelledby={`previous-slide`}
            >
              <IonIcon icon={chevronBackCircle} className={`text-3xl`} />
            </button>
          </div>
          {filteredVideos.map((vid, index) => {
            return (
              <SwiperSlide key={vid.key}>
                <LiteYouTubeEmbed
                  id={vid.key}
                  title={vid.name}
                  params={new URLSearchParams({
                    rel: 0,
                    start: 0,
                    enablejsapi: 1,
                    origin: window.location.origin,
                    widget_referrer: window.location.href,
                  }).toString()}
                  poster="maxresdefault"
                  // thumbnail={`https://img.youtube.com/vi/${vid.key}/maxresdefault.jpg`}
                  webp={true}
                />
              </SwiperSlide>
            );
          })}

          {images.slice(0, 10).map((img, index) => {
            return (
              <SwiperSlide key={index}>
                <figure className="swiper-zoom-container">
                  <img
                    src={`https://image.tmdb.org/t/p/w1280${img.file_path}`}
                    alt={``}
                    className={`h-full w-full object-cover`}
                    draggable={false}
                    loading="lazy"
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
